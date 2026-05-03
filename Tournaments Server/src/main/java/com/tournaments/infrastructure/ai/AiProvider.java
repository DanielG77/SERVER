package com.tournaments.infrastructure.ai;

import com.tournaments.presentation.request.SearchIntent;

public interface AiProvider {
    /**
     * Generate explanation for why a tournament matches the search query
     */
    String generateExplanation(String query, String tournamentData) throws Exception;

    /**
     * Interpret natural language query to extract search intent
     * Returns SearchIntent object with extracted filters and keywords
     */
    SearchIntent interpretQuery(String naturalLanguageQuery) throws Exception;

    /**
     * Get provider name
     */
    String getName();

    /**
     * Health check to verify provider availability
     */
    boolean isHealthy();
}
