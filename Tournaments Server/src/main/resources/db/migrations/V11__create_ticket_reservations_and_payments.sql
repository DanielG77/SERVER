-- V11: Create ticket reservations and payments tables and add capacity to tournaments

-- 1. Add capacity and tickets_sold to the tournaments table
ALTER TABLE public.tournaments
    ADD COLUMN capacity INTEGER,
    ADD COLUMN tickets_sold INTEGER DEFAULT 0;

-- Update existing tournaments with a default capacity if needed (optional)
-- UPDATE public.tournaments SET capacity = 100 WHERE capacity IS NULL;


-- 2. Create an ENUM type for reservation status
CREATE TYPE reservation_status AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED');

-- 3. Create the ticket_reservations table
CREATE TABLE public.ticket_reservations
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       BIGINT           NOT NULL,
    tournament_id UUID             NOT NULL,
    status        reservation_status NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id),
    CONSTRAINT fk_tournament FOREIGN KEY (tournament_id) REFERENCES public.tournaments (id)
);

CREATE INDEX idx_ticket_reservations_user_id ON public.ticket_reservations (user_id);
CREATE INDEX idx_ticket_reservations_tournament_id ON public.ticket_reservations (tournament_id);
CREATE INDEX idx_ticket_reservations_status ON public.ticket_reservations (status);


-- 4. Create the payments table
CREATE TABLE public.payments
(
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id           UUID             NOT NULL,
    stripe_payment_intent_id VARCHAR(255)     NOT NULL UNIQUE,
    amount                   DECIMAL(10, 2)   NOT NULL,
    currency                 VARCHAR(10)      NOT NULL,
    status                   VARCHAR(50)      NOT NULL,
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_reservation FOREIGN KEY (reservation_id) REFERENCES public.ticket_reservations (id)
);

CREATE INDEX idx_payments_reservation_id ON public.payments (reservation_id);
CREATE INDEX idx_payments_stripe_payment_intent_id ON public.payments (stripe_payment_intent_id);
