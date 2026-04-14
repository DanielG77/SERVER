package com.tournaments.infrastructure.ai;

import com.tournaments.domain.model.Tournament;

public interface AiGatewayService {
    /**
     * Generate explanation for tournament search result
     * Uses round-robin with 6 providers and automatic fallback
     * Non-blocking: returns graceful default if all providers fail
     */
    String generateExplanation(String query, Tournament tournament);

    /**
     * Get health status of all providers
     */
    AiHealthStatus getHealth();
}
