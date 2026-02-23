# Contributing Guide

## Architecture rules

This project follows **Hexagonal Architecture (Ports & Adapters)**. The single most important constraint is:

> **The `domain` package must never import `org.springframework.*`.**

Verify with:
```bash
grep -r "import org.springframework" src/main/java/com/tournaments/domain/
# Expected: no output
```

---

## Pagination pattern

### Domain layer (port)

The `TournamentRepository` interface (domain port) uses only domain-owned types:

```java
// com.tournaments.domain.repository.TournamentRepository
DomainPage<Tournament> findAll(TournamentFilter filter, PageableRequest pageableRequest);
```

`DomainPage<T>` and `PageableRequest` live in `com.tournaments.domain.pagination` and have **zero** external dependencies.

### Infrastructure layer (adapter)

`TournamentRepositoryImpl` is the only class allowed to touch Spring Data pagination:

```java
// com.tournaments.infrastructure.persistence.repositories.impl.TournamentRepositoryImpl
@Override
public DomainPage<Tournament> findAll(TournamentFilter filter, PageableRequest req) {
    Sort sort = Sort.by(Sort.Direction.fromString(req.getSortDirection()), req.getSortField());
    Pageable pageable = PageRequest.of(req.getPage(), req.getSize(), sort);

    Page<TournamentEntity> page = jpaTournamentRepository.findAll(spec, pageable);

    return new DomainPage<>(
        page.getContent().stream().map(TournamentMapper::toDomain).toList(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.getNumber(),
        page.getSize()
    );
}
```

### Presentation layer (controller)

The controller builds a `PageableRequest` from HTTP query parameters (converting 1-based page from UI to 0-based internally):

```java
// com.tournaments.presentation.controller.TournamentController
PageableRequest pageableRequest = new PageableRequest(
    page > 0 ? page - 1 : 0,  // UI sends 1-based; domain is 0-based
    limit,
    sortField,   // camelCase e.g. "createdAt"
    sortDir      // "asc" | "desc"
);
DomainPage<Tournament> result = tournamentService.getAllTournaments(filter, pageableRequest);
```

---

## Adding a new repository operation

1. **Declare the signature** in the domain port (`TournamentRepository.java`) using only domain/JDK types.
2. **Implement** in the adapter (`TournamentRepositoryImpl.java`) with Spring Data conversions confined to that class.
3. **Test** both levels:

   | Test class | Scope | Tooling |
   |---|---|---|
   | `TournamentRepositoryImplTest` | Unit — no Spring context | JUnit 5 + Mockito |
   | `TournamentRepositoryImplIT` | Integration — real PostgreSQL | JUnit 5 + Testcontainers |

---

## Commit strategy

| # | Scope | What goes in |
|---|---|---|
| 1 | `domain.pagination` | `DomainPage<T>`, `PageableRequest` |
| 2 | `domain.repository`, `application.service` | Port + service interface signature change |
| 3 | `infrastructure` adapter | `TournamentRepositoryImpl` conversion logic |
| 4 | Callers | `TournamentServiceImpl`, `TournamentController` |
| 5 | Tests | Unit + integration tests |

---

## Running tests

```bash
# Unit tests (no Docker needed)
mvn test -Dtest=TournamentRepositoryImplTest

# Integration tests (Docker required for Testcontainers)
mvn test -Dtest=TournamentRepositoryImplIT

# Full suite
mvn test
```
