package com.tournaments.application.service;

import java.util.UUID;

import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.request.CreateTournamentRequest;
import com.tournaments.presentation.request.UpdateTournamentRequest;
import com.tournaments.presentation.request.CancelTournamentRequest;
import com.tournaments.presentation.response.CancelTournamentResponse;

public interface TournamentService {

    Tournament createTournament(CreateTournamentRequest request, CustomUserDetails currentUser);

    DomainPage<Tournament> getAllTournaments(TournamentFilter filter, PageableRequest pageableRequest);

    Tournament getTournamentById(UUID id);

    Tournament getTournamentBySlug(String slug);

    Tournament updateTournament(UUID id, UpdateTournamentRequest request);

    void deleteTournament(UUID id, boolean hardDelete);

    CancelTournamentResponse cancelTournament(UUID id, CancelTournamentRequest request, CustomUserDetails currentUser);
}
