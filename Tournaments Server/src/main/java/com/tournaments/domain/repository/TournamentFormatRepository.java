package com.tournaments.domain.repository;

import java.util.List;
import java.util.Optional;

import com.tournaments.domain.model.TournamentFormat;

public interface TournamentFormatRepository {
    List<TournamentFormat> findAll();
    Optional<TournamentFormat> findById(Long id);
    Optional<TournamentFormat> findByName(String name);
    boolean existsById(Long id);
}