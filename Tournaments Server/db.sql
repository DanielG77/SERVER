CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE tournament_status AS ENUM ('draft','open','running','completed','cancelled');

CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    status tournament_status DEFAULT 'draft',
    price_client NUMERIC(10,2) NOT NULL DEFAULT 0,
    price_player NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    slug TEXT UNIQUE NOT NULL,

    -- Constraints
    CONSTRAINT price_client_non_negative CHECK (price_client >= 0),
    CONSTRAINT price_player_non_negative CHECK (price_player >= 0),
    CONSTRAINT valid_dates CHECK (
        (start_at IS NULL AND end_at IS NULL) OR
        (start_at IS NOT NULL AND (end_at IS NULL OR end_at >= start_at))
    )
);