-- src/main/resources/db/migration/V1__create_users_and_roles.sql

-- 1) Roles
CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2) Users
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3) Relación muchos-a-muchos users <-> roles
CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- 4) (Opcional) refresh tokens (si los vas a usar)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(512) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 5) Inserción de roles base
INSERT INTO roles (name, description)
VALUES ('ROLE_ADMIN', 'Administrador con todos los privilegios'),
       ('ROLE_CLIENT', 'Usuario cliente normal')
ON CONFLICT (name) DO NOTHING;

-- 6) Inserción de ejemplo de usuario
-- IMPORTANTE: sustituye '<BCRYPT_PASSWORD_HASH>' por el hash bcrypt real.
INSERT INTO users (username, email, password, enabled)
VALUES ('admin', 'admin@example.com', '<BCRYPT_PASSWORD_HASH>', true)
ON CONFLICT (username) DO NOTHING;

-- Asignar rol admin al usuario creado
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;
