package com.tournaments.application.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.tournaments.application.service.TournamentSearchService;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.infrastructure.ai.AiGatewayService;
import com.tournaments.presentation.response.TournamentSearchResultResponse;

@Service
public class TournamentSearchServiceImpl implements TournamentSearchService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentSearchServiceImpl.class);
    private static final int MAX_RESULTS = 20;

    private final TournamentRepository tournamentRepository;
    private final AiGatewayService aiGatewayService;

    public TournamentSearchServiceImpl(TournamentRepository tournamentRepository,
                                      AiGatewayService aiGatewayService) {
        this.tournamentRepository = tournamentRepository;
        this.aiGatewayService = aiGatewayService;
    }

    @Override
    public List<TournamentSearchResultResponse> searchTournaments(String query) {
        logger.info("Searching tournaments with query: {}", query);

        // 1. Extract keywords and infer filters
        SearchContext context = parseQuery(query);

        // 2. Normalize query for search
        String normalizedQuery = normalizeQuery(query);

        // 3. Get tournaments from database (all active ones first, then filter)
        // For MVP, fetch limited active tournaments and filter in memory
        List<Tournament> allTournaments = fetchActiveTournaments();

        if (allTournaments.isEmpty()) {
            logger.debug("No tournaments found in database");
            return new ArrayList<>();
        }

        // 4. Filter and score results
        List<TournamentSearchResult> scoredResults = allTournaments.stream()
            .map(t -> {
                double score = calculateScore(t, context, normalizedQuery);
                return new TournamentSearchResult(t, score);
            })
            .filter(r -> r.getScore() > 0)
            .sorted(Comparator.comparingDouble(TournamentSearchResult::getScore).reversed())
            .limit(MAX_RESULTS)
            .collect(Collectors.toList());

        if (scoredResults.isEmpty()) {
            logger.debug("No tournaments matched the search criteria");
            return new ArrayList<>();
        }

        // 5. For top 3 results, generate AI explanation (non-blocking)
        List<TournamentSearchResultResponse> finalResults = scoredResults.stream()
            .limit(3)
            .map(result -> enrichWithAiExplanation(result, query))
            .collect(Collectors.toList());

        // Add remaining results without AI explanation
        if (scoredResults.size() > 3) {
            scoredResults.stream()
                .skip(3)
                .forEach(result -> {
                    TournamentSearchResultResponse response = buildResponse(result, null);
                    finalResults.add(response);
                });
        }

        logger.info("Search completed: found {} results", finalResults.size());
        return finalResults;
    }

    /**
     * Parse query to extract keywords and infer filters
     */
    private SearchContext parseQuery(String query) {
        SearchContext context = new SearchContext();
        String lowerQuery = query.toLowerCase();

        // Date inference - Spanish and English
        if (lowerQuery.contains("este fin de semana") || lowerQuery.contains("this weekend")) {
            LocalDate today = LocalDate.now();
            int dayOfWeek = today.getDayOfWeek().getValue();
            LocalDate saturday = today.plusDays((6 - dayOfWeek) % 7);
            if (saturday.isBefore(today) || saturday.isEqual(today)) {
                saturday = saturday.plusDays(7);
            }
            context.setDateFrom(saturday.atStartOfDay());
            context.setDateTo(saturday.plusDays(2).atTime(23, 59, 59));
        } else if (lowerQuery.contains("hoy") || lowerQuery.contains("today")) {
            LocalDate today = LocalDate.now();
            context.setDateFrom(today.atStartOfDay());
            context.setDateTo(today.atTime(23, 59, 59));
        } else if (lowerQuery.contains("esta noche") || lowerQuery.contains("tonight")) {
            LocalDate today = LocalDate.now();
            context.setDateFrom(today.atTime(20, 0));
            context.setDateTo(today.atTime(23, 59, 59));
        } else if (lowerQuery.contains("próxima semana") || lowerQuery.contains("next week")) {
            LocalDate nextWeek = LocalDate.now().plusWeeks(1);
            context.setDateFrom(nextWeek.atStartOfDay());
            context.setDateTo(nextWeek.plusDays(6).atTime(23, 59, 59));
        } else if (lowerQuery.contains("fin de semana") || lowerQuery.contains("weekend")) {
            LocalDate today = LocalDate.now();
            int dayOfWeek = today.getDayOfWeek().getValue();
            LocalDate saturday = today.plusDays((6 - dayOfWeek) % 7);
            if (saturday.isBefore(today)) {
                saturday = saturday.plusDays(7);
            }
            context.setDateFrom(saturday.atStartOfDay());
            context.setDateTo(saturday.plusDays(2).atTime(23, 59, 59));
        }

        // Price inference
        if (lowerQuery.contains("barato") || lowerQuery.contains("cheap") || 
            lowerQuery.contains("gratis") || lowerQuery.contains("free")) {
            context.setMaxPrice(BigDecimal.valueOf(50));
        } else if (lowerQuery.contains("caro") || lowerQuery.contains("expensive")) {
            context.setMinPrice(BigDecimal.valueOf(100));
        }

        // Platform inference
        if (lowerQuery.contains("online")) {
            context.setIsOnline(true);
        } else if (lowerQuery.contains("presencial") || lowerQuery.contains("offline") || lowerQuery.contains("presenciales")) {
            context.setIsOnline(false);
        }

        // Extract game keywords
        context.setKeywords(extractKeywords(query));

        return context;
    }

    /**
     * Extract meaningful keywords from query
     */
    private List<String> extractKeywords(String query) {
        String[] stopwords = {
            "de", "del", "la", "el", "y", "o", "un", "una", "unos", "unas", 
            "para", "por", "en", "a", "al", "los", "las", "es", "son", "este",
            "the", "a", "an", "and", "or", "in", "for", "to", "is", "are", "this",
            "torneos", "torneo", "busco", "quiero", "necesito"
        };
        Set<String> stopSet = new HashSet<>(Arrays.asList(stopwords));

        return Arrays.stream(query.toLowerCase().split("\\s+"))
            .filter(word -> word.length() > 2 && !stopSet.contains(word) && word.matches("[a-záéíóú0-9]+"))
            .collect(Collectors.toList());
    }

    /**
     * Normalize query for search
     */
    private String normalizeQuery(String query) {
        return query.trim()
            .toLowerCase()
            .replaceAll("[^a-záéíóú0-9\\s]", "")
            .replaceAll("\\s+", " ");
    }

    /**
     * Fetch active tournaments from database
     */
    private List<Tournament> fetchActiveTournaments() {
        try {
            // Fetch max 100 active tournaments, ordered by most recent first
            var pageRequest = PageableRequest.ofDefaults();
            return tournamentRepository.findAll(pageRequest);
        } catch (Exception e) {
            logger.error("Error fetching tournaments", e);
            return new ArrayList<>();
        }
    }

    /**
     * Calculate relevance score for a tournament
     */
    private double calculateScore(Tournament tournament, SearchContext context, String normalizedQuery) {
        double score = 0.0;
        String lowerName = tournament.getName().toLowerCase();
        String lowerDesc = tournament.getDescription().toLowerCase();
        String lowerGame = tournament.getGame() != null ? tournament.getGame().getName().toLowerCase() : "";

        // Score based on keyword matches
        double keywordScore = 0.0;
        if (context.getKeywords() != null) {
            for (String keyword : context.getKeywords()) {
                // Match in name (highest weight)
                if (lowerName.contains(keyword)) {
                    keywordScore += 3.0;
                }
                // Match in game (high weight)
                else if (lowerGame.contains(keyword)) {
                    keywordScore += 2.0;
                }
                // Match in description (lower weight)
                else if (lowerDesc.contains(keyword)) {
                    keywordScore += 0.5;
                }
            }
        }

        score += keywordScore;

        // Bonus for date match
        if (context.getDateFrom() != null && tournament.getStartAt() != null) {
            if (tournament.getStartAt().isAfter(context.getDateFrom()) &&
                tournament.getStartAt().isBefore(context.getDateTo())) {
                score += 2.0;
            }
        }

        // Bonus for price match
        if (context.getMaxPrice() != null && tournament.getPriceClient() != null) {
            if (tournament.getPriceClient().compareTo(context.getMaxPrice()) <= 0) {
                score += 1.5;
            }
        }

        // Bonus for online/offline match
        if (context.getIsOnline() != null && context.getIsOnline() == tournament.isOnline()) {
            score += 0.5;
        }

        // Filter out tournaments with no keywords match if keywords were provided
        if (context.getKeywords() != null && !context.getKeywords().isEmpty() && keywordScore == 0) {
            return 0.0;
        }

        return score;
    }

    /**
     * Enrich result with AI explanation (non-blocking)
     */
    private TournamentSearchResultResponse enrichWithAiExplanation(TournamentSearchResult result, String query) {
        TournamentSearchResultResponse response = buildResponse(result, null);

        // Try to get AI explanation (non-blocking)
        try {
            String explanation = aiGatewayService.generateExplanation(query, result.getTournament());
            response.setReason(explanation);
        } catch (Exception e) {
            logger.warn("Failed to generate AI explanation: {}", e.getMessage());
            // Continue without AI explanation - degraded mode
        }

        return response;
    }

    /**
     * Build response from result
     */
    private TournamentSearchResultResponse buildResponse(TournamentSearchResult result, String reason) {
        return new TournamentSearchResultResponse(
            result.getTournament().getId(),
            result.getTournament().getName(),
            result.getTournament().getGame() != null ? result.getTournament().getGame().getName() : "Unknown",
            result.getTournament().getDescription(),
            result.getTournament().getPriceClient(),
            result.getTournament().getStartAt(),
            result.getTournament().getEndAt(),
            result.getTournament().isOnline(),
            result.getTournament().getMaxPlayers(),
            Math.min(result.getScore() / 10.0, 1.0), // Normalize score to 0-1 range
            reason
        );
    }

    /**
     * Internal class for search context
     */
    private static class SearchContext {
        private LocalDateTime dateFrom;
        private LocalDateTime dateTo;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private Boolean isOnline;
        private List<String> keywords;

        public LocalDateTime getDateFrom() { return dateFrom; }
        public void setDateFrom(LocalDateTime dateFrom) { this.dateFrom = dateFrom; }

        public LocalDateTime getDateTo() { return dateTo; }
        public void setDateTo(LocalDateTime dateTo) { this.dateTo = dateTo; }

        public BigDecimal getMinPrice() { return minPrice; }
        public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

        public BigDecimal getMaxPrice() { return maxPrice; }
        public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

        public Boolean getIsOnline() { return isOnline; }
        public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }

        public List<String> getKeywords() { return keywords; }
        public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    }

    /**
     * Internal class for search results with scores
     */
    private static class TournamentSearchResult {
        private Tournament tournament;
        private double score;

        public TournamentSearchResult(Tournament tournament, double score) {
            this.tournament = tournament;
            this.score = score;
        }

        public Tournament getTournament() { return tournament; }
        public double getScore() { return score; }
    }
}
