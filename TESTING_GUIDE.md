# 📝 GUÍA COMPLETA: TESTING DE DASHBOARDS ADMIN/USUARIO

## 📌 PREREQUISITES
1. Spring Boot application corriendo en `http://localhost:8080`
2. Base de datos PostgreSQL con migraciones V8-V10 ejecutadas
3. Datos de test insertados (ejecutar `setup-test-data.sql`)
4. Postman o curl instalado

---

## 🔑 PASO 1: OBTENER TOKENS JWT

### 1.1 Login como ADMIN
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testadmin",
    "password": "adminpass"
  }'
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0YWRtaW4i...",
    "refreshToken": "...",
    "username": "testadmin",
    "email": "admin@test.com",
    "roles": ["ROLE_ADMIN"]
  },
  "message": "Login successful"
}
```

**Guarda el token en una variable:**
```bash
ADMIN_TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0YWRtaW4i..."
```

### 1.2 Login como USER
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser1",
    "password": "userpass"
  }'
```

**Variables:**
```bash
USER1_TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlcjEi..."
USER2_TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlcjIi..."
```

---

## ✅ TEST SUITE 1: ADMIN TOURNAMENTS

### Test 1.1: Admin lista todos los torneos (incl. inactivos)
```bash
curl -X GET "http://localhost:8080/api/admin/tournaments?page=0&size=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- Contiene 4 torneos: 2 activos (user1, user2, admin), 1 inactivo (admin soft deleted)
- Campos incluyen: `id`, `name`, `status`, `isActive`, `userId`, `ownerUsername`

**Ejemplo response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "550e8400-e29b-41d4-a716-446655441001",
        "name": "User1 Tournament",
        "status": "open",
        "isActive": true,
        "userId": 1001,
        "ownerUsername": "testuser1",
        "gameId": 1,
        "gameName": "League of Legends",
        ...
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655441004",
        "name": "Admin Tournament (Inactive)",
        "status": "cancelled",
        "isActive": false,  // ← IMPORTANTE: admin ve inactivos
        "userId": 1000,
        "ownerUsername": "testadmin",
        ...
      },
      ...
    ],
    "totalElements": 4,
    "totalPages": 1,
    "currentPage": 0,
    "size": 20
  }
}
```

### Test 1.2: Admin obtiene UN torneo específico
```bash
curl -X GET "http://localhost:8080/api/admin/tournaments/550e8400-e29b-41d4-a716-446655441001" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:** Status `200 OK` + detalles del torneo

### Test 1.3: Admin CREA torneo (asignando propietario)
```bash
curl -X POST "http://localhost:8080/api/admin/tournaments?ownerId=1001" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin-Created Tournament",
    "description": "This tournament was created by admin but owned by testuser1",
    "status": "draft",
    "gameId": 1,
    "tournamentFormatId": 1,
    "priceClient": 75.50,
    "pricePlayer": 7.50,
    "isOnline": true,
    "minPlayers": 4,
    "maxPlayers": 128,
    "platformIds": [1, 2]
  }'
```

**Esperado:**
- Status: `201 Created`
- Response contiene `userId`: 1001, `ownerUsername`: "testuser1"

### Test 1.4: Admin ACTUALIZA torneo
```bash
curl -X PUT "http://localhost:8080/api/admin/tournaments/550e8400-e29b-41d4-a716-446655441001" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated by Admin",
    "status": "running",
    "priceClient": 150.00
  }'
```

**Esperado:** Status `200 OK` + torneo actualizado

### Test 1.5: Admin soft-DELETE torneo
```bash
curl -X DELETE "http://localhost:8080/api/admin/tournaments/550e8400-e29b-41d4-a716-446655441002" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- SQL: `UPDATE tournaments SET is_active = false WHERE id = ?`
- Torneo sigue en BD pero `isActive = false`

### Test 1.6: Admin HARD-DELETE torneo (eliminar físicamente)
```bash
curl -X DELETE "http://localhost:8080/api/admin/tournaments/550e8400-e29b-41d4-a716-446655441002?hardDelete=true" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- SQL: `DELETE FROM tournaments WHERE id = ?`
- Torneo eliminado completamente de BD (irreversible)

---

## ✅ TEST SUITE 2: ADMIN GAMES

### Test 2.1: Admin lista juegos
```bash
curl -X GET "http://localhost:8080/api/admin/games?page=0&size=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:** Status `200 OK` + Page de juegos

### Test 2.2: Admin CREA juego
```bash
curl -X POST "http://localhost:8080/api/admin/games" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Game",
    "description": "Brand new competitive game",
    "iconUrl": "https://example.com/game-icon.jpg",
    "releaseDate": "2024-01-15"
  }'
```

**Esperado:** Status `201 Created` + GameResponseDto

### Test 2.3: Admin actualiza juego
```bash
curl -X PUT "http://localhost:8080/api/admin/games/1" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Game Name",
    "description": "New description"
  }'
```

**Esperado:** Status `200 OK` + juego actualizado

### Test 2.4: Admin elimina juego
```bash
curl -X DELETE "http://localhost:8080/api/admin/games/1" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:** Status `200 OK` (eliminación física)

---

## ✅ TEST SUITE 3: ADMIN USERS

### Test 3.1: Admin lista usuarios
```bash
curl -X GET "http://localhost:8080/api/admin/users?page=0&size=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- Contiene usuarios activos e inactivos
- Campos: `id`, `username`, `email`, `enabled`, `isActive`, `roles`, `createdAt`

### Test 3.2: Admin obtiene usuario específico
```bash
curl -X GET "http://localhost:8080/api/admin/users/1001" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:** Status `200 OK` + UserResponseDto

### Test 3.3: Admin ACTUALIZA usuario
```bash
curl -X PUT "http://localhost:8080/api/admin/users/1001" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@test.com",
    "isActive": true,
    "roles": ["ROLE_CLIENT", "ROLE_ADMIN"]
  }'
```

**Esperado:**
- Status: `200 OK`
- Usuario actualizado con nuevo email y roles

### Test 3.4: Admin soft-DELETE usuario
```bash
curl -X DELETE "http://localhost:8080/api/admin/users/1002" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- SQL: `UPDATE users SET is_active = false WHERE id = 1002`
- Usuario inactivo pero datos preservados

### Test 3.5: Admin HARD-DELETE usuario
```bash
curl -X DELETE "http://localhost:8080/api/admin/users/1002?hardDelete=true" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- SQL: `DELETE FROM users WHERE id = 1002`
- Usuario eliminado completamente

---

## ✅ TEST SUITE 4: USER TOURNAMENTS

### Test 4.1: Usuario CREA torneo (se asigna como propietario)
```bash
curl -X POST "http://localhost:8080/api/user/tournaments" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Tournament",
    "description": "Created by user1",
    "status": "draft",
    "gameId": 1,
    "tournamentFormatId": 2,
    "priceClient": 50,
    "pricePlayer": 5,
    "isOnline": false,
    "minPlayers": 2,
    "maxPlayers": 16,
    "platformIds": [1]
  }'
```

**Esperado:**
- Status: `201 Created`
- Response: `userId` = 1001 (automaticamente asignado)
- `ownerUsername` = "testuser1"

### Test 4.2: Usuario lista SUS torneos
```bash
curl -X GET "http://localhost:8080/api/user/tournaments?page=0&size=20" \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- Solo torneos activos (`isActive = true`) que pertenecen a user1
- NO incluye torneos de otros usuarios

### Test 4.3: Usuario obtiene SU torneo
```bash
curl -X GET "http://localhost:8080/api/user/tournaments/550e8400-e29b-41d4-a716-446655441001" \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- Torneo con `userId = 1001`

### Test 4.4: Usuario ACTUALIZA SU torneo
```bash
curl -X PUT "http://localhost:8080/api/user/tournaments/550e8400-e29b-41d4-a716-446655441001" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated by User1",
    "status": "open"
  }'
```

**Esperado:** Status `200 OK` + torneo actualizado

### Test 4.5: Usuario soft-DELETE SU torneo
```bash
curl -X DELETE "http://localhost:8080/api/user/tournaments/550e8400-e29b-41d4-a716-446655441001" \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Esperado:**
- Status: `200 OK`
- SQL: `UPDATE tournaments SET is_active = false WHERE id = ? AND user_id = 1001`

---

## ❌ TEST SUITE 5: ACCESO DENEGADO (NEGATIVE TESTS)

### Test 5.1: Usuario intenta acceder /api/admin/tournaments
```bash
curl -X GET "http://localhost:8080/api/admin/tournaments" \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Esperado:**
- Status: `403 Forbidden`
- Response:
```json
{
  "success": false,
  "message": "Access Denied" // o "Forbidden"
}
```

### Test 5.2: Usuario intenta crear /api/admin/tournaments
```bash
curl -X POST "http://localhost:8080/api/admin/tournaments?ownerId=1001" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacked", ...}'
```

**Esperado:** Status `403 Forbidden`

### Test 5.3: User1 intenta actualizar torneo de User2
```bash
# User2 owns: 550e8400-e29b-41d4-a716-446655441002

curl -X PUT "http://localhost:8080/api/user/tournaments/550e8400-e29b-41d4-a716-446655441002" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacked Tournament"}'
```

**Esperado:**
- Status: `403 Forbidden`
- Message: "No tienes permiso para actualizar este torneo"

### Test 5.4: User1 intenta obtener torneo que no posee
```bash
curl -X GET "http://localhost:8080/api/user/tournaments/550e8400-e29b-41d4-a716-446655441002" \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Esperado:**
- Status: `403 Forbidden`
- Message: "No tienes permiso para acceder a este torneo"

### Test 5.5: Sin token (no autenticado)
```bash
curl -X GET "http://localhost:8080/api/admin/tournaments"
```

**Esperado:**
- Status: `401 Unauthorized`

### Test 5.6: Token inválido
```bash
curl -X GET "http://localhost:8080/api/admin/tournaments" \
  -H "Authorization: Bearer invalid_token_xyz"
```

**Esperado:**
- Status: `401 Unauthorized`

---

## ✅ TEST SUITE 6: FLUJOS INTEGRADOS

### Flow 1: Admin crea torneo para User1 → User1 puede verlo y actualizarlo
```bash
# 1. Admin crea torneo asignado a User1
TOURNAMENT_ID=$(curl -s -X POST "http://localhost:8080/api/admin/tournaments?ownerId=1001" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Created for User1",
    "gameId": 1,
    "tournamentFormatId": 1,
    "status": "draft",
    "priceClient": 100,
    "pricePlayer": 10
  }' | jq -r '.data.id')

echo "Created tournament: $TOURNAMENT_ID"

# 2. User1 lista sus torneos → debe incluir este
curl -X GET "http://localhost:8080/api/user/tournaments" \
  -H "Authorization: Bearer $USER1_TOKEN" | jq '.data.content[] | select(.id == "'$TOURNAMENT_ID'")'

# 3. User1 actualiza el torneo
curl -X PUT "http://localhost:8080/api/user/tournaments/$TOURNAMENT_ID" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "open", "name": "Updated by User1"}'

# 4. User2 intenta actualizar → 403 Forbidden
curl -X PUT "http://localhost:8080/api/user/tournaments/$TOURNAMENT_ID" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacked by User2"}'
# Esperado: 403
```

### Flow 2: Admin soft-deletes → Admin ve, User no
```bash
TOURNAMENT_ID="550e8400-e29b-41d4-a716-446655441001"

# 1. Admin soft-deletes
curl -X DELETE "http://localhost:8080/api/admin/tournaments/$TOURNAMENT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 2. Admin aún lo ve (en lista de admin)
curl -X GET "http://localhost:8080/api/admin/tournaments" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | jq '.data.content[] | select(.id == "'$TOURNAMENT_ID'")'
# Esperado: aparece con isActive = false

# 3. User NO lo ve (en su lista)
curl -X GET "http://localhost:8080/api/user/tournaments" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  | jq '.data.content[] | select(.id == "'$TOURNAMENT_ID'")'
# Esperado: vacío (no aparece)

# 4. User intenta acceder directamente → 403 (porque está inactivo o no suyo)
curl -X GET "http://localhost:8080/api/user/tournaments/$TOURNAMENT_ID" \
  -H "Authorization: Bearer $USER1_TOKEN"
# Esperado: 403 o no encontrado (depende de lógica)
```

---

## 📊 CHECKLIST DE VALIDACIÓN

- [ ] Login admin retorna token con rol ROLE_ADMIN
- [ ] Login usuario retorna token con rol ROLE_USER
- [ ] Admin lista todos torneos (incluyendo inactivos)
- [ ] Admin crea torneo y puede asignar propietario
- [ ] Admin actualiza cualquier torneo
- [ ] Admin soft-deletes: `is_active = false`
- [ ] Admin hard-deletes: eliminación física
- [ ] Admin lista usuarios (incluyendo inactivos)
- [ ] Admin actualiza usuario (email, roles, is_active)
- [ ] Admin crea/actualiza/elimina juegos
- [ ] Usuario crea torneo (automáticamente propietario)
- [ ] Usuario lista solo sus torneos activos
- [ ] Usuario obtiene su torneo (ID correcto)
- [ ] Usuario actualiza su torneo
- [ ] Usuario soft-deletes su torneo
- [ ] Usuario intenta acceder /api/admin → 403
- [ ] User1 intenta usar torneo de User2 → 403
- [ ] Sin token → 401
- [ ] Token inválido → 401
- [ ] Admin ve torneos inactivos, usuario no

---

## 🐞 TROUBLESHOOTING

### Error: "Access Denied"
→ Verifica que el token contiene el rol correcto en JWT

### Error: "No tienes permiso..."
→ El torneo no pertenece al usuario o está inactivo

### Error: "Usuario no encontrado"
→ El `ownerId` no existe en la BD

### Error: "Juego no encontrado"
→ El `gameId` no existe o fue deletado

### SQL Constraint Error (FK violation)
→ Asegúrate de que user_id, game_id, tournament_format_id existen antes de insertar

### Migraciones no corrieron
→ Verifica logs: `Flyway: V8__add_user_id...` durante startup
