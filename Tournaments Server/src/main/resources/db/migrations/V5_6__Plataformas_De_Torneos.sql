-- =================================================
-- TABLA: platforms
-- =================================================
CREATE TABLE platforms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);

INSERT INTO platforms (name) VALUES
('PC'),
('Xbox'),
('PlayStation'),
('Switch'),
('Mobile');

-- ============================================
-- 7) Tabla: tournament_platforms (N-N entre tournaments y platforms)
-- ============================================
CREATE TABLE IF NOT EXISTS tournament_platforms (
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    platform_id BIGINT NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    PRIMARY KEY (tournament_id, platform_id)
);

ALTER TABLE platforms
ADD COLUMN icon VARCHAR(500);
