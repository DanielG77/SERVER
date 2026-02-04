-- Migration: Create tournaments table
-- Version: 2
-- Description: Main tournaments table with all required columns

CREATE TABLE IF NOT EXISTS tournaments (
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

-- Comments
COMMENT ON TABLE tournaments IS 'Tournaments table for organizing and managing competitions';
COMMENT ON COLUMN tournaments.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN tournaments.name IS 'Tournament name';
COMMENT ON COLUMN tournaments.description IS 'Detailed description of the tournament';
COMMENT ON COLUMN tournaments.images IS 'JSON array of image URLs';
COMMENT ON COLUMN tournaments.status IS 'Current status of the tournament';
COMMENT ON COLUMN tournaments.price_client IS 'Price for clients in local currency';
COMMENT ON COLUMN tournaments.price_player IS 'Price for players in local currency';
COMMENT ON COLUMN tournaments.is_active IS 'Soft delete flag';
COMMENT ON COLUMN tournaments.created_at IS 'Creation timestamp';
COMMENT ON COLUMN tournaments.start_at IS 'Scheduled start time (optional)';
COMMENT ON COLUMN tournaments.end_at IS 'Scheduled end time (optional)';
COMMENT ON COLUMN tournaments.slug IS 'URL-friendly unique identifier';