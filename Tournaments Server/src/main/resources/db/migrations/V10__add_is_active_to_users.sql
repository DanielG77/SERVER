-- V10__add_is_active_to_users.sql
-- Agrega columna is_active para soft delete en la tabla users

ALTER TABLE users
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Crear índice para filtrar usuarios activos
CREATE INDEX idx_users_is_active ON users(is_active);

-- Crear índice compuesto para búsquedas: username + is_active
CREATE INDEX idx_users_username_is_active ON users(username, is_active);

-- Crear índice compuesto para búsquedas: email + is_active
CREATE INDEX idx_users_email_is_active ON users(email, is_active);
