package com.tournaments.application.service;

import java.util.List;

import com.tournaments.presentation.response.TournamentSearchResultResponse;

public interface TournamentSearchService {
    /**
     * Search tournaments using natural language query.
     * Infers filters automatically (price, date, online, game, etc.)
     * 
     * @param query Natural language query in Spanish or English
     * @return List of tournaments ranked by relevance with AI explanations
     */
    List<TournamentSearchResultResponse> searchTournaments(String query);
}
