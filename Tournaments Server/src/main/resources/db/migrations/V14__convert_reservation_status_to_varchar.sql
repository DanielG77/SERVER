-- V14: Convert ticket_reservations.status from ENUM to VARCHAR
-- Rationale: Use standardized VARCHAR for status handling across application
-- Aligns with how tournament_status is handled (V4__convert_tournament_status_to_varchar.sql)

-- Convert column type from reservation_status ENUM to VARCHAR
ALTER TABLE public.ticket_reservations
ALTER COLUMN status
TYPE VARCHAR(20) USING status::VARCHAR;

-- Drop the PostgreSQL ENUM type if it's not used elsewhere
DROP TYPE IF EXISTS reservation_status CASCADE;

COMMENT ON COLUMN public.ticket_reservations.status IS 'Reservation status: PENDING (awaiting payment), PAID (payment completed), REFUNDED (refunded to customer), CANCELLED (cancelled), EXPIRED (expired). Stored as VARCHAR for consistency across application.';
