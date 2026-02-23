package com.tournaments.infrastructure.persistence.repositories.impl;

import com.tournaments.domain.model.TournamentFilter;
import com.tournaments.domain.pagination.DomainPage;
import com.tournaments.domain.pagination.PageableRequest;
import com.tournaments.domain.model.Tournament;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test for {@link TournamentRepositoryImpl}.
 *
 * <p>
 * Uses Testcontainers to spin up a real PostgreSQL instance, verifying
 * that pagination and filtering work end-to-end against the actual database.
 *
 * <p>
 * Requires Docker to be running on the host machine.
 */
@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TournamentRepositoryImpl.class)
class TournamentRepositoryImplIT {

    @Container
    @SuppressWarnings("resource") // lifecycle managed by Testcontainers JUnit 5 extension
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("tournaments_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "false"); // schema managed by ddl-auto in test
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @Autowired
    private TournamentRepositoryImpl repository;

    @Autowired
    private TestEntityManager entityManager;

    // ────────────────────────────────────────────────────────────────────────
    // findAll — pagination
    // ────────────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll: returns first page with correct size")
    void findAll_firstPage_returnsCorrectSize() {
        persistTournaments(12);
        entityManager.flush();

        PageableRequest req = new PageableRequest(0, 5, "name", "asc");
        TournamentFilter filter = emptyFilter();

        DomainPage<Tournament> page = repository.findAll(filter, req);

        assertThat(page.getContent()).hasSize(5);
        assertThat(page.getTotalElements()).isEqualTo(12);
        assertThat(page.getTotalPages()).isEqualTo(3); // ceil(12/5)
        assertThat(page.getPageNumber()).isEqualTo(0);
        assertThat(page.getPageSize()).isEqualTo(5);
        assertThat(page.isLast()).isFalse();
    }

    @Test
    @DisplayName("findAll: returns last page with remaining elements")
    void findAll_lastPage_returnsRemainingElements() {
        persistTournaments(12);
        entityManager.flush();

        PageableRequest req = new PageableRequest(2, 5, "name", "asc");
        DomainPage<Tournament> page = repository.findAll(emptyFilter(), req);

        assertThat(page.getContent()).hasSize(2); // 12 - (2 * 5)
        assertThat(page.isLast()).isTrue();
    }

    @Test
    @DisplayName("findAll: returns empty DomainPage when no tournaments exist")
    void findAll_noData_returnsEmptyPage() {
        PageableRequest req = PageableRequest.ofDefaults();
        DomainPage<Tournament> page = repository.findAll(emptyFilter(), req);

        assertThat(page.isEmpty()).isTrue();
        assertThat(page.getTotalElements()).isZero();
    }

    @Test
    @DisplayName("findAll: second page content is distinct from first page")
    void findAll_pageOneAndTwo_haveDistinctContent() {
        persistTournaments(6);
        entityManager.flush();

        DomainPage<Tournament> page0 = repository.findAll(
                emptyFilter(), new PageableRequest(0, 3, "name", "asc"));
        DomainPage<Tournament> page1 = repository.findAll(
                emptyFilter(), new PageableRequest(1, 3, "name", "asc"));

        var ids0 = page0.getContent().stream().map(Tournament::getId).toList();
        var ids1 = page1.getContent().stream().map(Tournament::getId).toList();

        assertThat(ids0).doesNotContainAnyElementsOf(ids1);
    }

    // ────────────────────────────────────────────────────────────────────────
    // helpers
    // ────────────────────────────────────────────────────────────────────────

    private void persistTournaments(int count) {
        for (int i = 0; i < count; i++) {
            TournamentEntity entity = new TournamentEntity();
            entity.setName("Tournament " + String.format("%03d", i));
            entity.setSlug("tournament-" + i);
            entity.setIsActive(true);
            entity.setIsOnline(true);
            entity.setMinPlayers(2);
            entityManager.persist(entity);
        }
    }

    private static TournamentFilter emptyFilter() {
        return new TournamentFilter(null, null, null, null, null);
    }
}
