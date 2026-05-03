package com.tournaments.infrastructure.ai.impl;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tournaments.infrastructure.ai.AiProvider;
import com.tournaments.presentation.request.SearchIntent;

@Component
public class MistralProvider implements AiProvider {

    private static final Logger logger = LoggerFactory.getLogger(MistralProvider.class);
    private static final String NAME = "mistral";
    private static final String API_URL = "https://api.mistral.ai/v1/chat/completions";
    private static final Duration TIMEOUT = Duration.ofSeconds(5);

    @Value("${ai.mistral.api-key:}")
    private String apiKey;

    private final HttpClient httpClient;

    public MistralProvider() {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(TIMEOUT)
            .build();
    }

    @Override
    public String generateExplanation(String query, String tournamentData) throws Exception {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("Mistral API key not configured");
        }

        String prompt = String.format(
            "Explica brevemente (máximo 20 palabras) por qué este torneo encaja con la búsqueda.\n\n" +
            "Búsqueda: %s\n\n" +
            "Torneo: %s",
            query, tournamentData
        );

        String requestBody = String.format(
            "{\"model\":\"mistral-small-latest\",\"messages\":[{\"role\":\"user\",\"content\":\"%s\"}],\"max_tokens\":30}",
            escapeJson(prompt)
        );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .timeout(TIMEOUT)
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Mistral API error: " + response.body());
        }

        return extractContent(response.body());
    }

    @Override
    public SearchIntent interpretQuery(String naturalLanguageQuery) throws Exception {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("Mistral API key not configured");
        }

        String prompt = String.format(
            "You are a tournament search interpreter for an esports platform.\n" +
            "Extract structured search intent from the user query.\n\n" +
            "Instructions:\n" +
            "1. Extract ONLY a valid JSON object with exact field names\n" +
            "2. For gameName: Try exact match with common esports titles first (Dota 2, Valorant, Counter-Strike 2, League of Legends, Starcraft 2)\n" +
            "3. For confidence: 0.9+ if clear intent, 0.5-0.8 if partial/ambiguous, <0.5 if unclear\n" +
            "4. For dates: Use YYYY-MM-DD HH:mm format, assume current timezone\n" +
            "5. For prices: Return number only (e.g., 50, not '$50')\n\n" +
            "JSON Format (exact field names required):\n" +
            "{\n" +
            "  \"gameName\": \"exact game name or null\",\n" +
            "  \"dateFrom\": \"YYYY-MM-DD HH:mm or null\",\n" +
            "  \"dateTo\": \"YYYY-MM-DD HH:mm or null\",\n" +
            "  \"priceMin\": number or null,\n" +
            "  \"priceMax\": number or null,\n" +
            "  \"isOnline\": true/false or null,\n" +
            "  \"keywords\": [\"word1\", \"word2\"],\n" +
            "  \"confidence\": 0.0-1.0\n" +
            "}\n\n" +
            "User Query: \"%s\"\n" +
            "Today is: %s\n\n" +
            "Return ONLY the JSON object, no explanation.", 
            naturalLanguageQuery, 
            java.time.LocalDate.now()
        );

        String requestBody = String.format(
            "{\"model\":\"mistral-small-latest\",\"messages\":[{\"role\":\"user\",\"content\":\"%s\"}],\"max_tokens\":500}",
            escapeJson(prompt)
        );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .timeout(TIMEOUT)
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Mistral API error: " + response.body());
        }

        return parseSearchIntent(response.body());
    }

    private SearchIntent parseSearchIntent(String response) throws Exception {
        String jsonContent = extractContent(response);
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonContent);
            
            SearchIntent intent = new SearchIntent();
            intent.setGameName(root.has("gameName") && !root.get("gameName").isNull() ? root.get("gameName").asText() : null);
            intent.setPriceMin(root.has("priceMin") && !root.get("priceMin").isNull() ? java.math.BigDecimal.valueOf(root.get("priceMin").asDouble()) : null);
            intent.setPriceMax(root.has("priceMax") && !root.get("priceMax").isNull() ? java.math.BigDecimal.valueOf(root.get("priceMax").asDouble()) : null);
            intent.setIsOnline(root.has("isOnline") && !root.get("isOnline").isNull() ? root.get("isOnline").asBoolean() : null);
            intent.setConfidence(root.has("confidence") ? root.get("confidence").asDouble() : 0.5);
            
            // Parse keywords
            java.util.List<String> keywords = new ArrayList<>();
            if (root.has("keywords") && root.get("keywords").isArray()) {
                for (JsonNode keyword : root.get("keywords")) {
                    keywords.add(keyword.asText());
                }
            }
            intent.setKeywords(keywords);
            
            return intent;
        } catch (Exception e) {
            logger.warn("Failed to parse search intent JSON, using fallback", e);
            SearchIntent fallback = new SearchIntent();
            fallback.setConfidence(0.0);
            fallback.setKeywords(new ArrayList<>());
            return fallback;
        }
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean isHealthy() {
        if (apiKey == null || apiKey.isEmpty()) {
            return false;
        }

        try {
            String requestBody = "{\"model\":\"mistral-small-latest\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"max_tokens\":5}";
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .timeout(Duration.ofSeconds(2))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            logger.warn("Mistral health check failed", e);
            return false;
        }
    }

    private String extractContent(String response) {
        int start = response.indexOf("\"content\":\"");
        if (start == -1) return "Torneo relevante";

        int end = response.indexOf("\"", start + 11);
        if (end == -1) return "Torneo relevante";

        return response.substring(start + 11, end);
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
    }
}
