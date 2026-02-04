package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

@Repository
public interface JpaTournamentRepository
        extends JpaRepository<TournamentEntity, UUID>, JpaSpecificationExecutor<TournamentEntity> {

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);
}