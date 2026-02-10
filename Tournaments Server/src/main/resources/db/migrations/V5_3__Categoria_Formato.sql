CREATE TABLE tournament_formats (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    min_players INT DEFAULT 1,
    max_players INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);

-- Insertar formatos de torneos
INSERT INTO tournament_formats (name, description, min_players, max_players) VALUES
('1v1', 'Duelo individual', 1, 1),
('2v2', 'Equipos de 2 jugadores', 2, 2),
('5v5', 'Equipos de 5 jugadores', 5, 5),
('Solo', 'Todos contra todos', 1, 1),
('Por equipos', 'Equipos de tamaño variable', 3, 6),
('Battle Royale', 'Último en pie', 1, 100);
