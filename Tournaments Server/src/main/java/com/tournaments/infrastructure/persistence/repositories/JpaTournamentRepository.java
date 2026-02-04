package com.tournaments.infrastructure.persistence.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

@Repository
public interface JpaTournamentRepository extends JpaRepository<TournamentEntity, UUID> {

    // Find all active tournaments
    List<TournamentEntity> findByIsActiveTrue();

    // Find by slug
    Optional<TournamentEntity> findBySlug(String slug);

    // Find by status
    List<TournamentEntity> findByStatus(String status);

    // Find active tournaments by status
    List<TournamentEntity> findByStatusAndIsActiveTrue(String status);

    // Find tournaments by name (case-insensitive)
    List<TournamentEntity> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    // Check if slug exists
    boolean existsBySlug(String slug);

    // Count active tournaments
    long countByIsActiveTrue();
}