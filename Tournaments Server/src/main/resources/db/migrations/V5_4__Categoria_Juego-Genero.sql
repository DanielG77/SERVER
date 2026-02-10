CREATE TABLE game_genres (
    game_id BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (game_id, genre_id),
    CONSTRAINT fk_game_genres_game FOREIGN KEY (game_id)
        REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_game_genres_genre FOREIGN KEY (genre_id)
        REFERENCES genres(id) ON DELETE CASCADE
);

-- Asignar géneros a juegos (ejemplos)
INSERT INTO game_genres (game_id, genre_id) VALUES
(1, 1),  -- League of Legends: MOBA
(2, 2),  -- CS2: Shooter
(2, 9),  -- CS2: Táctico
(3, 2),  -- Valorant: Shooter
(3, 9),  -- Valorant: Táctico
(4, 1),  -- Dota 2: MOBA
(5, 3),  -- Fortnite: Battle Royale
(6, 6),  -- Rocket League: Deportes
(7, 5);  -- Street Fighter 6: Lucha
