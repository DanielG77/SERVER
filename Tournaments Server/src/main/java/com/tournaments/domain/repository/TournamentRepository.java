package com.tournaments.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;

/**
 * Domain port for Tournament persistence.
 * No Spring Data types allowed here — only domain / JDK types.
 */
public interface TournamentRepository {

    Tournament save(Tournament tournament);

    Optional<Tournament> findById(UUID id);

    Optional<Tournament> findBySlug(String slug);

    /**
     * Returns a page of tournaments matching the given filter and pagination
     * request.
     *
     * @param filter          criteria to narrow results (may be empty, never null)
     * @param pageableRequest pagination + sorting parameters (0-based page index)
     * @return a {@link DomainPage} containing the matching tournaments
     */
    DomainPage<Tournament> findAll(TournamentFilter filter, PageableRequest pageableRequest);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    void delete(UUID id);
}
