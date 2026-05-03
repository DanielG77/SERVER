CREATE OR REPLACE FUNCTION public.set_capacity_from_max_players()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo en INSERT: si capacity es NULL, copiar max_players
    IF NEW.capacity IS NULL THEN
        NEW.capacity := NEW.max_players;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- 3. TRIGGER (solo INSERT)
-- ============================================

DROP TRIGGER IF EXISTS trg_set_capacity ON public.tournaments;

CREATE TRIGGER trg_set_capacity
BEFORE INSERT ON public.tournaments
FOR EACH ROW
EXECUTE FUNCTION public.set_capacity_from_max_players();

