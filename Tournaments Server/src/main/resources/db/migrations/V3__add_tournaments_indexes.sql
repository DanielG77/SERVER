-- Migration: Add indexes for performance
-- Version: 3
-- Description: Create necessary indexes for query optimization

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);

-- Index for slug lookups (already unique, but helpful for performance)
CREATE INDEX IF NOT EXISTS idx_tournaments_slug ON tournaments(slug);

-- Index for active tournaments (common query)
CREATE INDEX IF NOT EXISTS idx_tournaments_is_active ON tournaments(is_active);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_tournaments_dates ON tournaments(start_at, end_at);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_tournaments_created_at ON tournaments(created_at DESC);

-- Index for price filtering
CREATE INDEX IF NOT EXISTS idx_tournaments_prices ON tournaments(price_client, price_player);

-- Partial index for active tournaments only
CREATE INDEX IF NOT EXISTS idx_tournaments_active_only ON tournaments(id) 
WHERE is_active = true;

COMMENT ON INDEX idx_tournaments_status IS 'Index for filtering by tournament status';
COMMENT ON INDEX idx_tournaments_slug IS 'Index for fast slug-based lookups';
COMMENT ON INDEX idx_tournaments_is_active IS 'Index for filtering active tournaments';
COMMENT ON INDEX idx_tournaments_dates IS 'Composite index for date range queries';
COMMENT ON INDEX idx_tournaments_created_at IS 'Index for sorting by creation date';
COMMENT ON INDEX idx_tournaments_prices IS 'Index for price filtering operations';
COMMENT ON INDEX idx_tournaments_active_only IS 'Partial index for querying only active tournaments';