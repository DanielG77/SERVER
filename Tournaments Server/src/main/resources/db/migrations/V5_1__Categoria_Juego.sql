CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);


-- Insertar juegos populares de esports
INSERT INTO games (name, description, icon_url, release_date) VALUES
('League of Legends', 'MOBA 5v5', '/icons/lol.png', '2009-10-27'),
('Counter-Strike 2', 'Shooter táctico 5v5', '/icons/cs2.png', '2023-09-27'),
('Valorant', 'Shooter táctico 5v5', '/icons/valorant.png', '2020-06-02'),
('Dota 2', 'MOBA 5v5', '/icons/dota2.png', '2013-07-09'),
('Fortnite', 'Battle Royale', '/icons/fortnite.png', '2017-07-21'),
('Rocket League', 'Fútbol con coches', '/icons/rocketleague.png', '2015-07-07'),
('Street Fighter 6', 'Juego de lucha', '/icons/sf6.png', '2023-06-02'),
('Tekken 7', 'Juego de lucha', '/icons/sf7.png', '2020-03-10'),
('Apex Legends', 'Battle Royale', '/icons/apex.png', '2019-02-04'),
('Overwatch 2', 'Shooter por equipos', '/icons/overwatch2.png', '2022-10-04');