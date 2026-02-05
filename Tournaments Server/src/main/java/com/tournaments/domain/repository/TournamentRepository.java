package com.tournaments.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;

public interface TournamentRepository {

    Tournament save(Tournament tournament);

    Optional<Tournament> findById(UUID id);

    Optional<Tournament> findBySlug(String slug);

    Page<Tournament> findAll(TournamentFilter filter, Pageable pageable);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    void delete(UUID id);
}
