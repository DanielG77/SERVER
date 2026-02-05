package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;
import com.tournaments.infrastructure.persistence.mappers.TournamentMapper;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentRepository;
import com.tournaments.infrastructure.persistence.specifications.TournamentSpecification;

@Repository
public class TournamentRepositoryImpl implements TournamentRepository {

    private final JpaTournamentRepository jpaTournamentRepository;

    public TournamentRepositoryImpl(JpaTournamentRepository jpaTournamentRepository) {
        this.jpaTournamentRepository = jpaTournamentRepository;
    }

    @Override
    public Optional<Tournament> findById(UUID id) {
        Objects.requireNonNull(id, "Invalid UUID: null");
        return jpaTournamentRepository.findById(id)
                .map(TournamentMapper::toDomain);
    }

    @Override
    public Optional<Tournament> findBySlug(String slug) {
        Objects.requireNonNull(slug, "Invalid Slug: null");
        return jpaTournamentRepository.findBySlug(slug)
                .map(TournamentMapper::toDomain);
    }

    @Override
    public Tournament save(Tournament tournament) {
        Objects.requireNonNull(tournament, "Tournament cannot be null");
        TournamentEntity entity = TournamentMapper.toEntity(tournament);
        TournamentEntity savedEntity = jpaTournamentRepository.save(entity);
        return TournamentMapper.toDomain(savedEntity);
    }

    @Override
    public Page<Tournament> findAll(TournamentFilter filter, Pageable pageable) {
        Specification<TournamentEntity> spec = TournamentSpecification.withFilter(filter);
        return jpaTournamentRepository.findAll(spec, pageable)
                .map(TournamentMapper::toDomain);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return jpaTournamentRepository.existsBySlug(slug);
    }

    @Override
    public boolean existsBySlugAndIdNot(String slug, UUID id) {
        return jpaTournamentRepository.existsBySlugAndIdNot(slug, id);
    }

    @Override
    public void delete(UUID id) {
        jpaTournamentRepository.deleteById(id);
    }
}
