package com.tournaments.application.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.presentation.request.CreateTournamentRequest;
import com.tournaments.presentation.request.UpdateTournamentRequest;

public interface TournamentService {

    Tournament createTournament(CreateTournamentRequest request);

    Page<Tournament> getAllTournaments(TournamentFilter filter, Pageable pageable);

    Tournament getTournamentById(UUID id);

    Tournament getTournamentBySlug(String slug);

    Tournament updateTournament(UUID id, UpdateTournamentRequest request);

    void deleteTournament(UUID id, boolean hardDelete);
}
