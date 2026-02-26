-- V9__add_is_active_to_tournaments.sql (idempotente)
-- Agrega columna is_active para soft delete en la tabla tournaments (no falla si ya existe)

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'tournaments'
          AND column_name = 'is_active'
    ) THEN
        ALTER TABLE tournaments
        ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
    END IF;
END
$$;

-- Crear índices sólo si no existen (Postgres soporta CREATE INDEX IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_tournaments_is_active ON tournaments(is_active);

CREATE INDEX IF NOT EXISTS idx_tournaments_status_is_active ON tournaments(status, is_active);

CREATE INDEX IF NOT EXISTS idx_tournaments_is_active_user_id_status ON tournaments(is_active, user_id, status);
