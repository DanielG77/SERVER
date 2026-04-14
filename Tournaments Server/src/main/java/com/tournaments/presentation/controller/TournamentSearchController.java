package com.tournaments.presentation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.service.TournamentSearchService;
import com.tournaments.presentation.request.TournamentSearchRequest;
import com.tournaments.presentation.response.TournamentSearchResponse;
import com.tournaments.presentation.response.TournamentSearchResultResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/tournaments/search")
@Validated
@CrossOrigin(origins = "*")
public class TournamentSearchController {

    private final TournamentSearchService tournamentSearchService;

    public TournamentSearchController(TournamentSearchService tournamentSearchService) {
        this.tournamentSearchService = tournamentSearchService;
    }

    @PostMapping
    public ResponseEntity<TournamentSearchResponse> search(@Valid @RequestBody TournamentSearchRequest request) {
        List<TournamentSearchResultResponse> results = tournamentSearchService.searchTournaments(request.getQuery());
        
        TournamentSearchResponse response = new TournamentSearchResponse(
            request.getQuery(),
            results
        );

        return ResponseEntity.ok(response);
    }
}
