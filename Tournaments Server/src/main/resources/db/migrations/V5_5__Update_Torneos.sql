-- Añadir nuevas columnas a tournaments (PostgreSQL ignora el orden)
ALTER TABLE tournaments
ADD COLUMN game_id BIGINT NOT NULL,
ADD COLUMN tournament_format_id BIGINT,
ADD COLUMN is_online BOOLEAN DEFAULT TRUE,
ADD COLUMN min_players INT DEFAULT 1,
ADD COLUMN max_players INT;

-- Añadir las restricciones FOREIGN KEY
ALTER TABLE tournaments
ADD CONSTRAINT fk_tournaments_game
    FOREIGN KEY (game_id) REFERENCES games(id);

ALTER TABLE tournaments
ADD CONSTRAINT fk_tournaments_format
    FOREIGN KEY (tournament_format_id) REFERENCES tournament_formats(id);

-- Establecer valores por defecto para torneos existentes
UPDATE tournaments 
SET game_id = 1,  -- Asignar League of Legends por defecto
    tournament_format_id = 3,  -- 5v5 por defecto
    is_online = TRUE
WHERE game_id IS NULL;
