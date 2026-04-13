-- V13: Add updated_at column to payments table for tracking refundo timestamps

ALTER TABLE public.payments
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create index on updated_at for potential queries on recent refunds
CREATE INDEX idx_payments_updated_at ON public.payments (updated_at);

COMMENT ON COLUMN public.payments.updated_at IS 'Timestamp of the last update to the payment record, used to track when refunds occur';
