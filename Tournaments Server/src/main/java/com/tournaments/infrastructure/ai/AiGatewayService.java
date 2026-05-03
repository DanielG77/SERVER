package com.tournaments.infrastructure.ai;

import com.tournaments.domain.model.Tournament;
import com.tournaments.presentation.request.SearchIntent;

public interface AiGatewayService {
    /**
     * Generate explanation for tournament search result
     * Uses round-robin with 6 providers and automatic fallback
     * Non-blocking: returns graceful default if all providers fail
     */
    String generateExplanation(String query, Tournament tournament);

    /**
     * Interpret natural language query to extract search intent
     * Uses round-robin with 6 providers and automatic fallback
     * Returns SearchIntent with confidence score (0-1)
     * If all providers fail, returns intent with confidence 0
     */
    SearchIntent interpretQuery(String naturalLanguageQuery);

    /**
     * Get health status of all providers
     */
    AiHealthStatus getHealth();
}
