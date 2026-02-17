-- Migration: Create tournament_status ENUM type
-- Version: 1
-- Description: Creates the ENUM type for tournament status

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tournament_status') THEN
        CREATE TYPE tournament_status AS ENUM ('draft', 'open', 'running', 'completed', 'cancelled');
    END IF;
END $$;


COMMENT ON TYPE tournament_status IS 'Possible statuses for a tournament: draft, open, running, completed, cancelled';