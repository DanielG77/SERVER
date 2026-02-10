package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tournaments.infrastructure.persistence.entities.TournamentFormatEntity;

public interface JpaTournamentFormatRepository extends JpaRepository<TournamentFormatEntity, Long> {
    Optional<TournamentFormatEntity> findByName(String name);
    List<TournamentFormatEntity> findByOrderByNameAsc();
}