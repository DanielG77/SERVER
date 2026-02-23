package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;
import com.tournaments.infrastructure.persistence.mappers.TournamentMapper;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentRepository;
import com.tournaments.infrastructure.persistence.specifications.TournamentSpecification;

/**
 * Infrastructure adapter: implements the domain {@link TournamentRepository}
 * port using JPA.
 *
 * <p>
 * Conversion responsibilities:
 * <ul>
 * <li>{@link PageableRequest} → Spring {@code Pageable} (stays inside this
 * class)</li>
 * <li>Spring {@code Page<TournamentEntity>} →
 * {@link DomainPage}{@code <Tournament>}</li>
 * </ul>
 */
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

    /**
     * Converts the domain {@link PageableRequest} into a Spring {@code Pageable},
     * runs the JPA query through the spec, and wraps the result as a
     * {@link DomainPage}.
     */
    @Override
    public DomainPage<Tournament> findAll(TournamentFilter filter, PageableRequest req) {
        Objects.requireNonNull(filter, "TournamentFilter must not be null");
        Objects.requireNonNull(req, "PageableRequest must not be null");

        Sort sort = Sort.by(Sort.Direction.fromString(req.getSortDirection()), req.getSortField());
        org.springframework.data.domain.Pageable pageable = PageRequest.of(req.getPage(), req.getSize(), sort);

        Specification<TournamentEntity> spec = TournamentSpecification.withFilter(filter);
        Page<TournamentEntity> page = jpaTournamentRepository.findAll(spec, pageable);

        return new DomainPage<>(
                page.getContent().stream().map(TournamentMapper::toDomain).toList(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize());
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
