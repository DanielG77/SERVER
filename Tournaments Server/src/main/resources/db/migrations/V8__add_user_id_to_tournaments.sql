-- V8__add_user_id_to_tournaments.sql
-- Agrega columna user_id (Foreign Key) a la tabla tournaments
-- para vincular cada torneo con su propietario/creador

ALTER TABLE tournaments
ADD COLUMN user_id BIGINT NOT NULL DEFAULT 1;

-- Agregar Foreign Key constraint a users
ALTER TABLE tournaments
ADD CONSTRAINT fk_tournaments_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;

-- Crear índice para búsquedas frecuentes de torneos por usuario
CREATE INDEX idx_tournaments_user_id ON tournaments(user_id);

-- Crear índice compuesto para búsquedas: usuario + estado
CREATE INDEX idx_tournaments_user_id_is_active ON tournaments(user_id, is_active);
