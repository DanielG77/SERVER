package com.tournaments.infrastructure.ai.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.tournaments.domain.model.Tournament;
import com.tournaments.infrastructure.ai.AiGatewayService;
import com.tournaments.infrastructure.ai.AiHealthStatus;
import com.tournaments.infrastructure.ai.AiProvider;
import com.tournaments.presentation.request.SearchIntent;

@Service
public class AiGatewayServiceImpl implements AiGatewayService {

    private static final Logger logger = LoggerFactory.getLogger(AiGatewayServiceImpl.class);
    private static final int MAX_RETRIES = 3;

    private final List<AiProvider> providers;
    private final AtomicInteger roundRobinCounter;

    public AiGatewayServiceImpl(GroqProvider groqProvider,
                               CerebrasProvider cerebrasProvider,
                               OpenRouterProvider openRouterProvider,
                               GeminiProvider geminiProvider,
                               MistralProvider mistralProvider,
                               CohereProvider cohereProvider) {
        this.providers = Arrays.asList(
            groqProvider,
            cerebrasProvider,
            openRouterProvider,
            geminiProvider,
            mistralProvider,
            cohereProvider
        );
        this.roundRobinCounter = new AtomicInteger(0);
    }

    @Override
    public String generateExplanation(String query, Tournament tournament) {
        String tournamentData = formatTournamentData(tournament);

        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                AiProvider provider = selectNextProvider();
                logger.info("Attempting AI explanation with provider: {}", provider.getName());

                String explanation = provider.generateExplanation(query, tournamentData);

                logger.info("Successfully generated explanation using provider: {}", provider.getName());
                return explanation;

            } catch (Exception e) {
                logger.warn("AI provider failed (attempt {}/{}): {}", attempt + 1, MAX_RETRIES, e.getMessage());

                if (attempt == MAX_RETRIES - 1) {
                    logger.error("All AI providers exhausted");
                    return "Torneo relevante para tu búsqueda";
                }
            }
        }

        return "Torneo relevante para tu búsqueda";
    }

    @Override
    public SearchIntent interpretQuery(String naturalLanguageQuery) {
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                AiProvider provider = selectNextProvider();
                logger.info("Attempting query interpretation with provider: {}", provider.getName());

                SearchIntent intent = provider.interpretQuery(naturalLanguageQuery);

                logger.info("Successfully interpreted query using provider: {}. Confidence: {}",
                    provider.getName(), intent.getConfidence());
                return intent;

            } catch (Exception e) {
                logger.warn("AI provider failed to interpret query (attempt {}/{}): {}",
                    attempt + 1, MAX_RETRIES, e.getMessage());

                if (attempt == MAX_RETRIES - 1) {
                    logger.error("All AI providers exhausted for query interpretation");
                    // Return intent with confidence 0 for fallback to heuristic parsing
                    SearchIntent fallbackIntent = new SearchIntent();
                    fallbackIntent.setConfidence(0.0);
                    fallbackIntent.setKeywords(extractKeywordsBasic(naturalLanguageQuery));
                    return fallbackIntent;
                }
            }
        }

        // Fallback response
        SearchIntent fallbackIntent = new SearchIntent();
        fallbackIntent.setConfidence(0.0);
        fallbackIntent.setKeywords(extractKeywordsBasic(naturalLanguageQuery));
        return fallbackIntent;
    }

    /**
     * Basic keyword extraction for fallback when AI fails
     */
    private List<String> extractKeywordsBasic(String query) {
        return Arrays.asList(query.toLowerCase().split("\\s+"));
    }

    @Override
    public AiHealthStatus getHealth() {
        Map<String, AiHealthStatus.ProviderStatus> providerStats = new HashMap<>();

        for (AiProvider provider : providers) {
            try {
                long start = System.currentTimeMillis();
                boolean healthy = provider.isHealthy();
                long latency = System.currentTimeMillis() - start;

                providerStats.put(provider.getName(),
                    new AiHealthStatus.ProviderStatus(healthy, latency, getModelName(provider.getName())));

            } catch (Exception e) {
                logger.warn("Failed to check health for provider: {}", provider.getName(), e);
                providerStats.put(provider.getName(),
                    new AiHealthStatus.ProviderStatus(false, 0L, null));
            }
        }

        boolean allDown = providerStats.values().stream().noneMatch(AiHealthStatus.ProviderStatus::getAvailable);
        String status = allDown ? "offline" : "online";

        return new AiHealthStatus(status, providerStats);
    }

    /**
     * Select next provider using round-robin
     */
    private AiProvider selectNextProvider() {
        int index = (roundRobinCounter.getAndIncrement() % providers.size());
        return providers.get(index);
    }

    /**
     * Format tournament data for AI prompt
     */
    private String formatTournamentData(Tournament tournament) {
        return String.format(
            "Nombre: %s\n" +
            "Juego: %s\n" +
            "Descripción: %s\n" +
            "Precio: $%s\n" +
            "Fecha de inicio: %s\n" +
            "Plataforma: %s",
            tournament.getName(),
            tournament.getGame() != null ? tournament.getGame().getName() : "Unknown",
            tournament.getDescription(),
            tournament.getPriceClient(),
            tournament.getStartAt(),
            tournament.isOnline() ? "Online" : "Presencial"
        );
    }

    /**
     * Get model name for provider
     */
    private String getModelName(String providerName) {
        return switch (providerName) {
            case "groq" -> "mixtral-8x7b-32768";
            case "cerebras" -> "llama-3.1-70b";
            case "gemini" -> "gemini-pro";
            case "openrouter" -> "openrouter/auto";
            case "mistral" -> "mistral-small-latest";
            case "cohere" -> "command";
            default -> "unknown";
        };
    }
}
