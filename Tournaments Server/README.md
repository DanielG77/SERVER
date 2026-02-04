# Feiz Tournament Management System

A Spring Boot application for managing tournaments using Clean Architecture principles.

## 📋 Project Structure
TournamentsServer/
├── src/main/java/com/tournaments/
│ ├── presentation/ # Presentation layer (Controllers, Request/Response DTOs)
│ ├── application/ # Application layer (Services, Use Cases)
│ ├── domain/ # Domain layer (Business models, Repository interfaces)
│ └── infrastructure/ # Infrastructure layer (Persistence, Configurations)
├── src/main/resources/
│ ├── db/migrations/ # Database migrations (SQL files)
│ └── application.properties # Application configuration
└── pom.xml # Maven dependencies


## 🚀 Quick Start

### Prerequisites
- Java 11 or higher
- Maven 3.6+
- PostgreSQL 12+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feiz

# Create PostgreSQL database
createdb feizdb

# Or using Docker
docker run --name feiz-postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=feizdb -p 5432:5432 -d postgres:15

# Build and run the application
mvn clean install
mvn spring-boot:run

# Run database migrations
mvn flyway:migrate

# Database Schema
CREATE TABLE tournaments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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