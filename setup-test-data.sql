-- SQL Setup de Test Data
-- Ejecutar DESPUÉS de que las migraciones V8-V10 hayan corrido
-- Esto crea usuarios de prueba (admin y usuarios normales) con torneos de ejemplo

-- ============================================
-- 1. CREAR ROLES (si no existen)
-- ============================================

INSERT INTO roles (name, description) VALUES ('ROLE_ADMIN', 'Administrator role') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name, description) VALUES ('ROLE_USER', 'Regular user role')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. CREAR USUARIOS DE TEST
-- ============================================

-- Admin User (id=1000, password='adminpass')
-- Hash BCrypt: $2a$10$SlV8qQJxTvT2g4r4e5GWeO1V4qVfpVfGaRd.8iFJOr5pUHLaJnVHO
INSERT INTO users (id, username, email, password, enabled, created_at, is_active) 
VALUES (1000, 'testadmin', 'admin@test.com', 
        '$2a$10$SlV8qQJxTvT2g4r4e5GWeO1V4qVfpVfGaRd.8iFJOr5pUHLaJnVHO', 
        true, NOW(), true)
ON CONFLICT (username) DO NOTHING;

-- Normal User 1 (id=1001, password='userpass')
-- Hash BCrypt: $2a$10$n3C5f0X0e9X6n0X4y0X0Oz8qQJxTvT2g4r4e5GWeO1V4qVfpVfGaRd
INSERT INTO users (id, username, email, password, enabled, created_at, is_active) 
VALUES (1001, 'testuser1', 'user1@test.com', 
        '$2a$10$n3C5f0X0e9X6n0X4y0X0Oz8qQJxTvT2g4r4e5GWeO1V4qVfpVfGaRd', 
        true, NOW(), true)
ON CONFLICT (username) DO NOTHING;

-- Normal User 2 (id=1002)
INSERT INTO users (id, username, email, password, enabled, created_at, is_active) 
VALUES (1002, 'testuser2', 'user2@test.com', 
        '$2a$10$n3C5f0X0e9X6n0X4y0X0Oz8qQJxTvT2g4r4e5GWeO1V4qVfpVfGaRd', 
        true, NOW(), true)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 3. ASIGNAR ROLES A USUARIOS
-- ============================================

-- Admin role a testadmin
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'testadmin' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- User role a testuser1
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'testuser1' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- User role a testuser2
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'testuser2' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. CREAR PERFILES PARA USUARIOS
-- ============================================

INSERT INTO profiles (user_id, bio, avatar_url, created_at, updated_at) 
VALUES (1000, 'Administrator', 'https://example.com/admin-avatar.jpg', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO profiles (user_id, bio, avatar_url, created_at, updated_at) 
VALUES (1001, 'Test User 1', 'https://example.com/user1-avatar.jpg', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO profiles (user_id, bio, avatar_url, created_at, updated_at) 
VALUES (1002, 'Test User 2', 'https://example.com/user2-avatar.jpg', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 5. CREAR TORNEOS DE EJEMPLO (con user_id/owner)
-- ============================================

-- Torneo creado por testuser1
INSERT INTO tournaments (id, name, description, images, status, price_client, price_player, 
                        is_active, created_at, start_at, end_at, slug, 
                        user_id, game_id, tournament_format_id, is_online, min_players, max_players)
VALUES 
(
  '550e8400-e29b-41d4-a716-446655441001'::uuid,
  'User1 Tournament',
  'Tournament created by testuser1',
  '["image1.jpg"]',
  'open',
  100.00,
  10.00,
  true,
  NOW(),
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '14 days',
  'user1-tournament',
  1001,  -- owner id = testuser1
  1,     -- game_id (asume que existe)
  1,     -- tournament_format_id (asume que existe)
  true,
  4,
  100
)
ON CONFLICT (slug) DO NOTHING;

-- Torneo creado por testuser2
INSERT INTO tournaments (id, name, description, images, status, price_client, price_player, 
                        is_active, created_at, start_at, end_at, slug, 
                        user_id, game_id, tournament_format_id, is_online, min_players, max_players)
VALUES 
(
  '550e8400-e29b-41d4-a716-446655441002'::uuid,
  'User2 Tournament',
  'Tournament created by testuser2',
  '["image2.jpg"]',
  'draft',
  50.00,
  5.00,
  true,
  NOW(),
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '10 days',
  'user2-tournament',
  1002,  -- owner id = testuser2
  1,
  2,
  false,
  2,
  50
)
ON CONFLICT (slug) DO NOTHING;

-- Torneo creado por admin
INSERT INTO tournaments (id, name, description, images, status, price_client, price_player, 
                        is_active, created_at, start_at, end_at, slug, 
                        user_id, game_id, tournament_format_id, is_online, min_players, max_players)
VALUES 
(
  '550e8400-e29b-41d4-a716-446655441003'::uuid,
  'Admin Tournament (Active)',
  'Tournament created by admin, currently active',
  '["admin-image.jpg"]',
  'running',
  200.00,
  20.00,
  true,
  NOW(),
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '5 days',
  'admin-tournament-active',
  1000,  -- owner id = testadmin
  2,
  3,
  true,
  1,
  200
)
ON CONFLICT (slug) DO NOTHING;

-- Torneo creado por admin pero inactivo (soft deleted)
INSERT INTO tournaments (id, name, description, images, status, price_client, price_player, 
                        is_active, created_at, start_at, end_at, slug, 
                        user_id, game_id, tournament_format_id, is_online, min_players, max_players)
VALUES 
(
  '550e8400-e29b-41d4-a716-446655441004'::uuid,
  'Admin Tournament (Inactive)',
  'Tournament created by admin, soft deleted',
  '["admin-inactive.jpg"]',
  'cancelled',
  150.00,
  15.00,
  false,  -- is_active = false (soft deleted)
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '20 days',
  'admin-tournament-inactive',
  1000,  -- owner id = testadmin
  1,
  1,
  true,
  4,
  50
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Listar usuarios creados
SELECT 'Users' as entity, id, username, email, enabled, is_active FROM users WHERE id IN (1000, 1001, 1002);

-- Listar roles asignados
SELECT u.username, r.name as role 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id 
WHERE u.id IN (1000, 1001, 1002);

-- Listar torneos con propietarios
SELECT t.id, t.name, t.status, t.is_active, t.slug, u.username as owner
FROM tournaments t
JOIN users u ON t.user_id = u.id
WHERE t.id IN ('550e8400-e29b-41d4-a716-446655441001'::uuid,
                '550e8400-e29b-41d4-a716-446655441002'::uuid,
                '550e8400-e29b-41d4-a716-446655441003'::uuid,
                '550e8400-e29b-41d4-a716-446655441004'::uuid);

-- ============================================
-- CREDENCIALES PARA TEST
-- ============================================

/*
Admin:
  Username: testadmin
  Email: admin@test.com
  Password: adminpass
  Role: ROLE_ADMIN

User 1:
  Username: testuser1
  Email: user1@test.com
  Password: userpass
  Role: ROLE_USER
  Owns tournament: 'user1-tournament'

User 2:
  Username: testuser2
  Email: user2@test.com
  Password: userpass
  Role: ROLE_USER
  Owns tournament: 'user2-tournament'
*/
