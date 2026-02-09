-- Migration: Convert tournament.status from ENUM to VARCHAR
-- Version: 4

ALTER TABLE public.tournaments
ALTER COLUMN status
TYPE VARCHAR(20) USING status::VARCHAR;
