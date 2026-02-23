package com.tournaments.infrastructure.persistence.repositories.impl;

import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link TournamentRepositoryImpl}.
 *
 * <p>
 * Validates that:
 * <ul>
 * <li>{@link PageableRequest} is correctly mapped to a Spring
 * {@link Pageable}</li>
 * <li>A Spring {@link Page} response is correctly wrapped in a
 * {@link DomainPage}</li>
 * <li>Edge cases (empty results, null guards) are handled properly</li>
 * </ul>
 *
 * No Spring context is loaded — uses Mockito only.
 */
@SuppressWarnings("unchecked") // Mockito any(Specification.class) requires raw type
@ExtendWith(MockitoExtension.class)
class TournamentRepositoryImplTest {

    @Mock
    private JpaTournamentRepository jpaTournamentRepository;

    private TournamentRepositoryImpl repository;

    @BeforeEach
    void setUp() {
        repository = new TournamentRepositoryImpl(jpaTournamentRepository);
    }

    // ────────────────────────────────────────────────────────────────────────
    // findAll — pagination conversion
    // ────────────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll: PageableRequest is correctly translated to Spring Pageable")
    void findAll_translatesPageableRequestToSpringPageable() {
        // Given
        PageableRequest req = new PageableRequest(2, 5, "name", "asc");
        TournamentFilter filter = emptyFilter();

        Page<TournamentEntity> springPage = new PageImpl<>(
                Collections.emptyList(),
                org.springframework.data.domain.PageRequest.of(2, 5,
                        org.springframework.data.domain.Sort.by(
                                org.springframework.data.domain.Sort.Direction.ASC, "name")),
                0L);

        when(jpaTournamentRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(springPage);

        // When
        repository.findAll(filter, req);

        // Then — capture the Pageable that was passed to JPA
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(jpaTournamentRepository).findAll(any(Specification.class), pageableCaptor.capture());

        Pageable captured = pageableCaptor.getValue();
        assertThat(captured.getPageNumber()).isEqualTo(2);
        assertThat(captured.getPageSize()).isEqualTo(5);
        assertThat(captured.getSort().getOrderFor("name")).isNotNull();
        assertThat(captured.getSort().getOrderFor("name").getDirection())
                .isEqualTo(org.springframework.data.domain.Sort.Direction.ASC);
    }

    @Test
    @DisplayName("findAll: Spring Page is correctly wrapped into DomainPage")
    void findAll_wrapsInDomainPageCorrectly() {
        // Given
        PageableRequest req = new PageableRequest(0, 10, "createdAt", "desc");
        TournamentFilter filter = emptyFilter();

        TournamentEntity entity = buildMinimalEntity();
        Page<TournamentEntity> springPage = new PageImpl<>(
                List.of(entity),
                org.springframework.data.domain.PageRequest.of(0, 10),
                42L); // totalElements

        when(jpaTournamentRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(springPage);

        // When
        DomainPage<Tournament> result = repository.findAll(filter, req);

        // Then
        assertThat(result.getTotalElements()).isEqualTo(42L);
        assertThat(result.getTotalPages()).isEqualTo(5); // ceil(42/10)
        assertThat(result.getPageNumber()).isEqualTo(0);
        assertThat(result.getPageSize()).isEqualTo(10);
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getId()).isEqualTo(entity.getId());
    }

    @Test
    @DisplayName("findAll: returns empty DomainPage when JPA returns empty page")
    void findAll_emptyResult_returnsDomainPageWithEmptyContent() {
        PageableRequest req = new PageableRequest(0, 10, "createdAt", "desc");
        TournamentFilter filter = emptyFilter();

        Page<TournamentEntity> emptySpringPage = new PageImpl<>(
                Collections.emptyList(),
                org.springframework.data.domain.PageRequest.of(0, 10),
                0L);

        when(jpaTournamentRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(emptySpringPage);

        DomainPage<Tournament> result = repository.findAll(filter, req);

        assertThat(result.isEmpty()).isTrue();
        assertThat(result.getTotalElements()).isZero();
        assertThat(result.getTotalPages()).isZero();
    }

    @Test
    @DisplayName("findAll: throws NullPointerException when filter is null")
    void findAll_nullFilter_throwsNullPointerException() {
        PageableRequest req = PageableRequest.ofDefaults();
        assertThatThrownBy(() -> repository.findAll(null, req))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("TournamentFilter");
    }

    @Test
    @DisplayName("findAll: throws NullPointerException when PageableRequest is null")
    void findAll_nullPageableRequest_throwsNullPointerException() {
        TournamentFilter filter = emptyFilter();
        assertThatThrownBy(() -> repository.findAll(filter, null))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("PageableRequest");
    }

    @Test
    @DisplayName("DomainPage is immutable — content list copy prevents external mutation")
    void domainPage_contentIsImmutable() {
        // Creates a DomainPage and verifies the returned list is unmodifiable
        DomainPage<String> page = new DomainPage<>(
                List.of("a", "b"), 2, 1, 0, 10);

        assertThatThrownBy(() -> page.getContent().add("c"))
                .isInstanceOf(UnsupportedOperationException.class);
    }

    // ────────────────────────────────────────────────────────────────────────
    // helpers
    // ────────────────────────────────────────────────────────────────────────

    private static TournamentFilter emptyFilter() {
        return new TournamentFilter(null, null, null, null, null);
    }

    private static TournamentEntity buildMinimalEntity() {
        TournamentEntity entity = new TournamentEntity();
        entity.setId(UUID.randomUUID());
        entity.setName("Test Tournament");
        entity.setSlug("test-tournament");
        entity.setIsActive(true);
        entity.setIsOnline(true);
        entity.setMinPlayers(2);
        return entity;
    }
}
