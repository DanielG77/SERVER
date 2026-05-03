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
import com.tournaments.domain.enums.TournamentStatus;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.domain.repository.GameRepository;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.infrastructure.ai.AiGatewayService;
import com.tournaments.presentation.request.SearchIntent;
import com.tournaments.presentation.response.TournamentSearchResultResponse;

@Service
public class TournamentSearchServiceImpl implements TournamentSearchService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentSearchServiceImpl.class);
    private static final int MAX_RESULTS = 20;
    private static final double CONFIDENCE_THRESHOLD_HIGH = 0.75;
    private static final double CONFIDENCE_THRESHOLD_MERGE = 0.50;

    private final TournamentRepository tournamentRepository;
    private final GameRepository gameRepository;
    private final AiGatewayService aiGatewayService;

    public TournamentSearchServiceImpl(TournamentRepository tournamentRepository,
                                      GameRepository gameRepository,
                                      AiGatewayService aiGatewayService) {
        this.tournamentRepository = tournamentRepository;
        this.gameRepository = gameRepository;
        this.aiGatewayService = aiGatewayService;
    }

    @Override
    public List<TournamentSearchResultResponse> searchTournaments(String query) {
        logger.info("Searching tournaments with query: {}", query);

        // 1. Parse query with AI + fallback
        SearchContext context = parseQuery(query);
        logger.info("Search context: gameId={}, dates={}-{}, isOnline={}, keywords={}, aiConfidence={}, source={}",
            context.getGameId(),
            context.getDateFrom(),
            context.getDateTo(),
            context.getIsOnline(),
            context.getKeywords(),
            context.getAiConfidence(),
            context.getAiInterpretation());

        // 2. Fetch from DB (not all tournaments!)
        List<Tournament> results = fetchActiveTournaments(context);
        
        if (results.isEmpty()) {
            logger.debug("No tournaments matched search criteria");
            return new ArrayList<>();
        }

        // 3. Score (in memory, minimal set)
        String normalizedQuery = normalizeQuery(query);
        List<TournamentSearchResult> scoredResults = results.stream()
            .map(t -> new TournamentSearchResult(t, calculateScore(t, context, normalizedQuery)))
            .sorted(Comparator.comparingDouble(TournamentSearchResult::getScore).reversed())
            .limit(MAX_RESULTS)
            .collect(Collectors.toList());

        if (scoredResults.isEmpty()) {
            logger.debug("No tournaments scored above threshold");
            return new ArrayList<>();
        }

        // 4. Enrich top 3 with AI explanations
        List<TournamentSearchResultResponse> finalResults = scoredResults.stream()
            .limit(3)
            .map(result -> enrichWithAiExplanation(result, query))
            .collect(Collectors.toList());

        // Add remaining without explanations
        if (scoredResults.size() > 3) {
            scoredResults.stream().skip(3).map(r -> buildResponse(r, null)).forEach(finalResults::add);
        }

        logger.info("Search completed: returned {} from {} candidates", finalResults.size(), results.size());
        return finalResults;
    }

    /**
     * Parse query to extract keywords and infer filters
     * First attempts AI interpretation, falls back to heuristic parsing
     * Supports soft degradation: confidence 0.5-0.75 merges AI + heuristic
     */
    private SearchContext parseQuery(String query) {
        try {
            SearchIntent aiIntent = aiGatewayService.interpretQuery(query);
            
            if (aiIntent == null) {
                logger.warn("AI returned null intent, using heuristic");
                return parseQueryHeuristic(query);
            }
            
            // Normalize confidence
            Double confidence = aiIntent.getConfidence() != null ? aiIntent.getConfidence() : 0.0;
            
            if (confidence >= CONFIDENCE_THRESHOLD_HIGH) {
                // Full AI trust (>= 0.75)
                logger.info("Using AI interpretation with confidence: {}", confidence);
                return buildSearchContextFromAiIntent(aiIntent);
            } 
            else if (confidence >= CONFIDENCE_THRESHOLD_MERGE) {
                // Merge AI + Heuristic (0.5-0.75)
                logger.info("Merging AI ({}) + Heuristic for better coverage", confidence);
                SearchContext aiContext = buildSearchContextFromAiIntent(aiIntent);
                SearchContext heuristicContext = parseQueryHeuristic(query);
                return mergeContexts(aiContext, heuristicContext);
            } 
            else {
                // AI confidence too low (< 0.50)
                logger.info("AI confidence {} too low, using heuristic", confidence);
                return parseQueryHeuristic(query);
            }
            
        } catch (Exception e) {
            logger.warn("AI interpretation failed, falling back to heuristic parsing: {}", e.getMessage());
            return parseQueryHeuristic(query);
        }
    }

    /**
     * Resolve game name from AI to gameId
     * Tries exact match first, then prefix match
     */
    private Long resolveGameId(String gameName) {
        if (gameName == null || gameName.isEmpty()) {
            return null;
        }
        
        try {
            // Try 1: Exact case-insensitive match
            var game = gameRepository.findByNameIgnoreCase(gameName);
            if (game.isPresent()) {
                logger.debug("Found exact game match: {} → {}", gameName, game.get().getId());
                return game.get().getId();
            }
            
            // Try 2: Prefix match (Dota 2 → Dota 2 Championship)
            var gamePrefix = gameRepository.findByNameIgnoreCaseContaining(gameName);
            if (!gamePrefix.isEmpty()) {
                Long id = gamePrefix.get(0).getId();
                logger.debug("Found prefix game match: {} → {}", gameName, id);
                return id;
            }
            
            logger.debug("No game found for: {}", gameName);
            return null;
        } catch (Exception e) {
            logger.warn("Error resolving game name '{}': {}", gameName, e.getMessage());
            return null;
        }
    }

    /**
     * Build SearchContext from AI SearchIntent
     */
    private SearchContext buildSearchContextFromAiIntent(SearchIntent intent) {
        SearchContext context = new SearchContext();
        context.setAiInterpretation("AI interpretation");
        context.setAiConfidence(intent.getConfidence());
        
        // Dates (with validation)
        if (intent.getDateFrom() != null && intent.getDateTo() != null) {
            validateDateRange(intent.getDateFrom(), intent.getDateTo());
            context.setDateFrom(intent.getDateFrom());
            context.setDateTo(intent.getDateTo());
        } else if (intent.getDateFrom() != null) {
            context.setDateFrom(intent.getDateFrom());
        } else if (intent.getDateTo() != null) {
            context.setDateTo(intent.getDateTo());
        }
        
        // Prices
        if (intent.getPriceMin() != null) {
            context.setMinPrice(intent.getPriceMin());
        }
        if (intent.getPriceMax() != null) {
            context.setMaxPrice(intent.getPriceMax());
        }
        
        // Platform
        if (intent.getIsOnline() != null) {
            context.setIsOnline(intent.getIsOnline());
        }
        
        // CRITICAL: Resolve gameName to gameId
        if (intent.getGameName() != null && !intent.getGameName().isEmpty()) {
            Long gameId = resolveGameId(intent.getGameName());
            context.setGameId(gameId);
            logger.debug("Resolved game: '{}' → gameId={}", intent.getGameName(), gameId);
        }
        
        // Keywords (only if needed for fuzzy matching)
        if (intent.getKeywords() != null && !intent.getKeywords().isEmpty()) {
            context.setKeywords(intent.getKeywords());
        }
        
        return context;
    }

    /**
     * Merge AI context with heuristic context for soft degradation
     */
    private SearchContext mergeContexts(SearchContext aiContext, SearchContext heuristicContext) {
        // AI provides structure, heuristic augments with keywords and fills gaps
        if (aiContext.getGameId() == null && heuristicContext.getGameId() != null) {
            aiContext.setGameId(heuristicContext.getGameId());
            logger.debug("Merged gameId from heuristic");
        }
        
        if ((aiContext.getKeywords() == null || aiContext.getKeywords().isEmpty()) && 
            heuristicContext.getKeywords() != null && !heuristicContext.getKeywords().isEmpty()) {
            aiContext.setKeywords(heuristicContext.getKeywords());
            logger.debug("Merged keywords from heuristic");
        }
        
        // Keep AI's structured dates/prices, don't override with heuristic
        return aiContext;
    }

    /**
     * Heuristic query parsing (original logic)
     */
    private SearchContext parseQueryHeuristic(String query) {
        SearchContext context = new SearchContext();
        context.setAiInterpretation("Heuristic parsing");
        context.setAiConfidence(0.0);
        
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
     * Fetch active tournaments from database using context filters
     */
    private List<Tournament> fetchActiveTournaments(SearchContext context) {
        try {
            logger.debug("Fetching tournaments with context filters: gameId={}, dates={}-{}, online={}, priceRange={}-{}",
                context.getGameId(),
                context.getDateFrom(),
                context.getDateTo(),
                context.getIsOnline(),
                context.getMinPrice(),
                context.getMaxPrice());
            
            // Build TournamentFilter from SearchContext
            // Use OPEN status for tournaments that are actively accepting registrations
            TournamentFilter filter = new TournamentFilter(
                TournamentStatus.OPEN,  // Only open tournaments
                true,  // isActive
                context.getDateFrom(),
                context.getDateTo(),
                null,  // search (using structured filters instead)
                context.getGameId(),  // gameId
                List.of(),  // genreIds
                List.of(),  // platformIds
                null,  // formatId
                context.getIsOnline(),
                null,  // minPlayers
                null   // maxPlayers
            );
            
            // Fetch max 100 active tournaments from DB
            PageableRequest pageRequest = PageableRequest.ofDefaults();
            DomainPage<Tournament> page = tournamentRepository.findAll(filter, pageRequest);
            
            logger.debug("Fetched {} tournaments from DB", page.getTotalElements());
            return page.getContent();
        } catch (Exception e) {
            logger.error("Error fetching tournaments with context", e);
            return new ArrayList<>();
        }
    }

    /**
     * Calculate relevance score for a tournament
     * LAYER 1: Deterministic filter matches (highest weight)
     * LAYER 2: Keyword/fuzzy matches (fallback)
     */
    private double calculateScore(Tournament tournament, SearchContext context, String normalizedQuery) {
        double score = 0.0;
        String lowerName = tournament.getName().toLowerCase();
        String lowerDesc = tournament.getDescription() != null ? tournament.getDescription().toLowerCase() : "";
        String lowerGame = tournament.getGame() != null ? tournament.getGame().getName().toLowerCase() : "";

        // LAYER 1: Deterministic filter matches (high weight)
        // These should have been pre-filtered by DB, but checking for scoring
        if (context.getGameId() != null && tournament.getGame() != null && 
            tournament.getGame().getId().equals(context.getGameId())) {
            score += 100.0;
            logger.debug("Tournament {}: +100 (gameId exact match)", tournament.getId());
        }

        if (context.getIsOnline() != null && context.getIsOnline() == tournament.isOnline()) {
            score += 50.0;
            logger.debug("Tournament {}: +50 (online match)", tournament.getId());
        }

        if (context.getDateFrom() != null && tournament.getStartAt() != null) {
            if (isWithinDateRange(tournament.getStartAt(), context.getDateFrom(), context.getDateTo())) {
                score += 50.0;
                logger.debug("Tournament {}: +50 (date match)", tournament.getId());
            }
        }

        if (context.getMaxPrice() != null && tournament.getPriceClient() != null) {
            if (tournament.getPriceClient().compareTo(context.getMaxPrice()) <= 0) {
                score += 30.0;
                logger.debug("Tournament {}: +30 (price match)", tournament.getId());
            }
        }

        // LAYER 2: Keyword/fuzzy matches (only if gameId was null or not matched)
        if (context.getGameId() == null && context.getKeywords() != null && !context.getKeywords().isEmpty()) {
            double keywordScore = calculateKeywordScore(tournament, context.getKeywords());
            score += keywordScore;
            if (keywordScore > 0) {
                logger.debug("Tournament {}: +{} (keyword match)", tournament.getId(), keywordScore);
            }
        }

        // LAYER 3: Fallback to keyword matching if no deterministic match and keywords exist
        if (score == 0.0 && context.getKeywords() != null && !context.getKeywords().isEmpty()) {
            double keywordScore = calculateKeywordScore(tournament, context.getKeywords());
            score = keywordScore;
            if (keywordScore > 0) {
                logger.debug("Tournament {}: +{} (fallback keyword match)", tournament.getId(), keywordScore);
            }
        }

        return score;
    }

    /**
     * Calculate score based on keyword matches
     */
    private double calculateKeywordScore(Tournament tournament, List<String> keywords) {
        double score = 0.0;
        String lowerName = tournament.getName().toLowerCase();
        String lowerDesc = tournament.getDescription() != null ? tournament.getDescription().toLowerCase() : "";
        String lowerGame = tournament.getGame() != null ? tournament.getGame().getName().toLowerCase() : "";

        for (String keyword : keywords) {
            if (lowerName.contains(keyword)) {
                score += 20.0;
            } else if (lowerGame.contains(keyword)) {
                score += 15.0;
            } else if (lowerDesc.contains(keyword)) {
                score += 5.0;
            }
        }

        return score;
    }

    /**
     * Check if date is within range
     */
    private boolean isWithinDateRange(LocalDateTime start, LocalDateTime from, LocalDateTime to) {
        if (from == null && to == null) return true;
        if (from != null && start.isBefore(from)) return false;
        if (to != null && start.isAfter(to)) return false;
        return true;
    }

    /**
     * Validate date range (from <= to)
     */
    private void validateDateRange(LocalDateTime from, LocalDateTime to) {
        if (from != null && to != null && from.isAfter(to)) {
            logger.warn("Invalid date range: {} > {}", from, to);
        }
        if (from != null && from.isBefore(LocalDateTime.now())) {
            logger.warn("Date from {} is in the past", from);
        }
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
        private Long gameId;
        private String aiInterpretation;
        private Double aiConfidence;

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

        public Long getGameId() { return gameId; }
        public void setGameId(Long gameId) { this.gameId = gameId; }

        public String getAiInterpretation() { return aiInterpretation; }
        public void setAiInterpretation(String aiInterpretation) { this.aiInterpretation = aiInterpretation; }

        public Double getAiConfidence() { return aiConfidence; }
        public void setAiConfidence(Double aiConfidence) { this.aiConfidence = aiConfidence; }
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
