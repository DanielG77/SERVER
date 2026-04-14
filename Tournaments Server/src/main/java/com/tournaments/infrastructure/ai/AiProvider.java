package com.tournaments.infrastructure.ai;

public interface AiProvider {
    /**
     * Generate explanation for why a tournament matches the search query
     */
    String generateExplanation(String query, String tournamentData) throws Exception;

    /**
     * Get provider name
     */
    String getName();

    /**
     * Health check to verify provider availability
     */
    boolean isHealthy();
}
