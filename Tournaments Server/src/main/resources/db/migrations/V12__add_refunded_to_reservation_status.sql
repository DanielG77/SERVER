-- V12: Add REFUNDED status to reservation_status ENUM
-- Description: Extends reservation_status enum to support refunded reservations

-- Add REFUNDED value to existing reservation_status enum
-- Note: PostgreSQL 9.1+ supports ALTER TYPE ADD VALUE
-- BEFORE clause ensures REFUNDED appears after PAID in the enum order
ALTER TYPE reservation_status ADD VALUE 'REFUNDED' AFTER 'PAID';

COMMENT ON TYPE reservation_status IS 'Reservation status states: PENDING (awaiting payment), PAID (payment completed), CANCELLED (cancelled), EXPIRED (expired), REFUNDED (refunded to customer)';
