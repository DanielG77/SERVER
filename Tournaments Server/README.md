# Feiz Tournament Management System

A Spring Boot application for managing tournaments using Clean Architecture principles.

## 📋 Project Structure
```
TournamentsServer/
├── src/main/java/com/tournaments/
│   ├── presentation/    # Controllers, Request/Response DTOs
│   ├── application/     # Services, Use Cases
│   ├── domain/          # Business models, Repository ports, pagination
│   │   └── pagination/  # DomainPage<T>, PageableRequest  ← pure POJOs
│   └── infrastructure/  # JPA adapters, Flyway, Spring config
├── src/main/resources/
│   ├── db/migrations/   # Flyway SQL migrations
│   └── application.properties
└── pom.xml
```

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- Maven 3.9+
- PostgreSQL 15+
- Docker (required for integration tests via Testcontainers)

### Run locally
```bash
# Create PostgreSQL database
docker run --name feiz-postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=feizdb -p 5432:5432 -d postgres:16

# Build and run
mvn spring-boot:run
```

### Run tests
```bash
# Unit tests only (no Docker required)
mvn test -Dtest=TournamentRepositoryImplTest

# Integration tests (requires Docker)
mvn test -Dtest=TournamentRepositoryImplIT

# All tests
mvn test
```

## 🏛️ Architecture — Ports & Adapters

This project follows **Hexagonal Architecture (Ports & Adapters)**. The key rule is:
> **The `domain` layer must not import `org.springframework.*`**.

### Pagination abstraction

| Class | Layer | Purpose |
|---|---|---|
| `DomainPage<T>` | `domain.pagination` | Immutable page result — pure POJO |
| `PageableRequest` | `domain.pagination` | Pagination + sort intent — pure POJO |
| `TournamentRepository` | `domain.repository` | **Port** — defines `findAll(filter, PageableRequest)` |
| `TournamentRepositoryImpl` | `infrastructure` | **Adapter** — converts `PageableRequest` ↔ Spring `Pageable` |

### Flow
```
HTTP Request
    │ page=1&limit=10&sort=created_at:desc
    ▼
TournamentController          (presentation)
    │ builds PageableRequest(page=0, size=10, "createdAt", "desc")
    ▼
TournamentService             (application)
    │ passes PageableRequest to repository port
    ▼
TournamentRepository          (domain port — interface only)
    │ DomainPage<Tournament> findAll(filter, pageableRequest)
    ▼
TournamentRepositoryImpl      (infrastructure adapter)
    │ converts PageableRequest → Spring Pageable
    │ calls JpaTournamentRepository.findAll(spec, pageable)
    │ converts Page<TournamentEntity> → DomainPage<Tournament>
    ▼
DomainPage<Tournament>        returned back up the stack
```

### Adding a new repository method
1. Add the signature to the **domain port** (`TournamentRepository.java`) using only domain types.
2. Implement it in the **adapter** (`TournamentRepositoryImpl.java`) with any necessary Spring Data conversions.
3. Write a unit test (Mockito) and an integration test (Testcontainers) in `src/test/`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🗄️ Database Schema (excerpt)
```sql
CREATE TABLE tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  images jsonb DEFAULT '[]'::jsonb,
  status tournament_status DEFAULT 'draft',
  price_client numeric(10,2) NOT NULL DEFAULT 0,
  price_player numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  start_at timestamptz,
  end_at timestamptz,
  slug text UNIQUE NOT NULL
);
```
