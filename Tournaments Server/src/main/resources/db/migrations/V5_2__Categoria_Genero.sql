CREATE TABLE genres (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);


-- Insertar géneros de videojuegos
INSERT INTO genres (name) VALUES
('MOBA'),
('Shooter'),
('Battle Royale'),
('Estrategia'),
('Lucha'),
('Deportes'),
('Carreras'),
('RPG'),
('Táctico'),
('Simulación');