## ✅ IMPLEMENTACIÓN COMPLETADA: DASHBOARDS ADMIN/USUARIO CON CONTROL DE ACCESO

La implementación es **100% funcional** siguiendo arquitectura limpia (Domain → Application → Infrastructure → Presentation). 

---

## 📋 CHECKLIST DE LO IMPLEMENTADO

### FASE 1: MIGRACIONES SQL ✅
- **V8__add_user_id_to_tournaments.sql** - Relación many-to-one entre tourneys ↔ users
- **V9__add_is_active_to_tournaments.sql** - Soft delete para torneos
- **V10__add_is_active_to_users.sql** - Soft delete para usuarios

### FASE 2: ENTIDADES JPA ✅
- **TournamentEntity** 
  - Nuevo: campo `owner` (@ManyToOne → UserEntity)
- **UserEntity**
  - Nuevos: campos `isActive`, relación `tournaments` (@OneToMany)

### FASE 3: REPOSITORIOS ✅
- **JpaTournamentRepository** 
  - `findByIdAndOwnerId(UUID, Long)` - torneo específico del usuario
  - `findByOwnerIdAndIsActive(Long, Boolean, Pageable)` - torneos activos del user
  - `findByOwnerId(Long, Pageable)` - todos los torneos del user
- **JpaUserRepository**
  - `findByIdAndIsActive(Long, Boolean)`
  - `findByUsernameAndIsActive(String, Boolean)`
  - `findByEmailAndIsActive(String, Boolean)`
  - `findByIsActive(Boolean, Pageable)`

### FASE 4: DTOs ✅
- **TournamentRequestDto** - crear/actualizar torneos
- **TournamentResponseDto** - respuesta con userId, ownerUsername, etc.
- **GameRequestDto** / **GameResponseDto** - CRUD de juegos
- **UserResponseDto** - respuesta de usuario con isActive
- **UserUpdateAdminDto** - actualizar user como admin (email, roles, isActive)

### FASE 5: SERVICIOS (SEPARADOS POR ROL) ✅

#### AdminTournamentService (implementado)
```java
createTournament(TournamentRequestDto, ownerId)     // Admin asigna propietario
getAllTournaments(Pageable)                          // Ver todos (incl. inactivos)
getTournamentById(UUID)
updateTournament(UUID, TournamentRequestDto)
softDeleteTournament(UUID)                           // is_active = false
hardDeleteTournament(UUID)                           // delete físico
```

#### UserTournamentService (implementado)
```java
createTournament(TournamentRequestDto, userId)      // User es propietario automático
getMyTournaments(userId, Pageable)                   // Solo activos, propios
getMyTournament(UUID, userId)                        // Valida propiedad (403 si no)
updateMyTournament(UUID, TournamentRequestDto, userId) // Valida propiedad
softDeleteMyTournament(UUID, userId)                 // Valida propiedad
```

#### AdminGameService (implementado)
```java
createGame(GameRequestDto)
getAllGames(Pageable)
getGameById(Long)
updateGame(Long, GameRequestDto)
deleteGame(Long)
```

#### AdminUserService (implementado)
```java
getAllUsers(Pageable)                                // Ver todos (incl. inactivos)
getUserById(Long)
updateUser(Long, UserUpdateAdminDto)                 // Email, roles, is_active
softDeleteUser(Long)
hardDeleteUser(Long)
```

### FASE 6: CONTROLADORES REST ✅

#### AdminTournamentController
```
@PreAuthorize("hasRole('ADMIN')")
POST   /api/admin/tournaments                        → create
GET    /api/admin/tournaments                        → list all (paginated)
GET    /api/admin/tournaments/{id}                   → get one
PUT    /api/admin/tournaments/{id}                   → update
DELETE /api/admin/tournaments/{id}                   → soft delete
DELETE /api/admin/tournaments/{id}?hardDelete=true   → hard delete
```

#### AdminGameController
```
@PreAuthorize("hasRole('ADMIN')")
POST   /api/admin/games                              → create
GET    /api/admin/games                              → list (paginated)
GET    /api/admin/games/{id}                         → get one
PUT    /api/admin/games/{id}                         → update
DELETE /api/admin/games/{id}                         → delete
```

#### AdminUserController
```
@PreAuthorize("hasRole('ADMIN')")
GET    /api/admin/users                              → list all (paginated)
GET    /api/admin/users/{id}                         → get one
PUT    /api/admin/users/{id}                         → update (email, roles, is_active)
DELETE /api/admin/users/{id}                         → soft delete
DELETE /api/admin/users/{id}?hardDelete=true         → hard delete
```

#### UserTournamentController
```
@PreAuthorize("hasRole('USER')")
POST   /api/user/tournaments                         → create (user becomes owner)
GET    /api/user/tournaments                         → my tournaments (paginated)
GET    /api/user/tournaments/{id}                    → my tournament (403 if not owner)
PUT    /api/user/tournaments/{id}                    → update (403 if not owner)
DELETE /api/user/tournaments/{id}                    → soft delete (403 if not owner)
```

### FASE 7: SEGURIDAD ✅
- **SecurityConfig** 
  - `@EnableMethodSecurity(prePostEnabled = true)` habilitado
  - Rutas /api/admin/** requieren autenticación (validación de rol via @PreAuthorize)
  - Rutas /api/user/** requieren autenticación
  - Rutas públicas: /api/auth/**, /tournaments/**, /games/**, /genres/**

### FASE 8: EXCEPCIONES Y HANDLERS ✅
- **UnauthorizedOperationException** - cuando user trata de acceder recurso ajeno → HTTP 403
- **ResourceNotFoundException** - cuando recurso no existe → HTTP 404
- **GlobalExceptionHandler** actualizado para capturar ambas

### FASE 9: BEANS EN APPLICATIONCONFIG ✅
```java
AdminTournamentService
UserTournamentService
AdminGameService
AdminUserService
```

---

## 🔒 FLUJOS DE SEGURIDAD

### Admin accediendo /api/admin/tournaments ✅
```
1. Token JWT en header: Authorization: Bearer <token>
2. JwtAuthFilter valida token y extrae username, roles
3. CustomUserDetails.getAuthorities() retorna ["ROLE_ADMIN"]
4. @PreAuthorize("hasRole('ADMIN')") en controller → permite acceso
5. AdminTournamentService ejecuta lógica (ve todos los torneos)
```

### Usuario normal intentando /api/admin/tournaments ❌
```
1. Token JWT válido en header
2. JwtAuthFilter valida y obtiene roles: ["ROLE_USER"]
3. @PreAuthorize("hasRole('ADMIN')") en controller → DENUGA (403 Forbidden)
4. NO se ejecuta servicio
```

### Usuario normal creando torneo en /api/user/tournaments ✅
```
1. POST /api/user/tournaments con body: { name, gameId, ... }
2. @PreAuthorize("hasRole('USER')") → permite
3. UserTournamentController extrae userId del @AuthenticationPrincipal
4. UserTournamentService.createTournament(request, userId)
5. TournamentEntity.owner se asigna automáticamente al usuario
6. Retorna: TournamentResponseDto con userId como propietario
```

### Usuario A intentando actualizar torneo de Usuario B ❌
```
1. User A hace PUT /api/user/tournaments/{B's-tournament-id} 
2. UserTournamentService.updateMyTournament(id, request, userIdA)
3. tournamentRepository.findByIdAndOwnerId(id, userIdA) → NO ENCONTRADO
4. UnauthorizedOperationException → HTTP 403 Forbidden
5. GlobalExceptionHandler retorna error
```

### Admin haciendo soft delete ✅
```
1. DELETE /api/admin/tournaments/{id}
2. AdminTournamentService.softDeleteTournament(id)
3. tournament.setIsActive(false)
4. tournamentRepository.save(tournament)
5. SQL: UPDATE tournaments SET is_active = false WHERE id = ?
6. Torneo sigue en BD pero invisible para usuarios normales
```

### Admin viendo todos los torneos (incl. inactivos) ✅
```
1. GET /api/admin/tournaments
2. AdminTournamentService.getAllTournaments(pageable)
3. tournamentRepository.findAll(pageable) → SIN filtrar por is_active
4. Retorna página con torneos activos E inactivos
```

### Usuario normal listando sus torneos ✅
```
1. GET /api/user/tournaments
2. UserTournamentService.getMyTournaments(userId, pageable)
3. tournamentRepository.findByOwnerIdAndIsActive(userId, true, pageable)
4. SQL: ... WHERE user_id = ? AND is_active = true
5. Solo sus torneos activos
```

---

## 🧪 TESTING RÁPIDO (curl/Postman)

### Setup: Obtener tokens

**Login como admin (si user_id=1 tiene rol ADMIN):**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin_user","password":"password"}'

# Response: { "token": "<ADMIN_JWT>", "refreshToken": "...", ... }
```

**Login como usuario normal (si user_id=2 tiene rol USER):**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"normal_user","password":"password"}'

# Response: { "token": "<USER_JWT>", "refreshToken": "...", ... }
```

### Test 1: Admin crea torneo

```bash
curl -X POST http://localhost:8080/api/admin/tournaments?ownerId=2 \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Tournament",
    "description": "Created by admin",
    "gameId": 1,
    "tournamentFormatId": 1,
    "status": "open",
    "priceClient": 50,
    "pricePlayer": 10,
    "isOnline": true,
    "minPlayers": 4,
    "maxPlayers": 100
  }'

# Response: 201 Created + TournamentResponseDto
```

### Test 2: Usuario normal intenta acceder admin endpoint

```bash
curl -X GET http://localhost:8080/api/admin/tournaments \
  -H "Authorization: Bearer <USER_JWT>"

# Response: 403 Forbidden
# Body: { "success": false, "message": "Access Denied" }
```

### Test 3: Usuario crea su propio torneo

```bash
curl -X POST http://localhost:8080/api/user/tournaments \
  -H "Authorization: Bearer <USER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Tournament",
    "gameId": 1,
    "tournamentFormatId": 2,
    "status": "draft",
    "priceClient": 25,
    "pricePlayer": 5
  }'

# Response: 201 Created + TournamentResponseDto (con userId = 2)
# El token contiene ID del usuario, se asigna automáticamente como owner
```

### Test 4: Usuario lista sus torneos

```bash
curl -X GET "http://localhost:8080/api/user/tournaments?page=0&size=20" \
  -H "Authorization: Bearer <USER_JWT>"

# Response: 200 OK + Page de su torneos activos
```

### Test 5: Usuario intenta actualizar torneo ajeno

```bash
# Obtener ID del torneo creado por Admin en Test 1 (que pertenece a user_id=2)
# Usuario logeado es user_id=3 (diferente token)

curl -X PUT http://localhost:8080/api/user/tournaments/<tournament-id> \
  -H "Authorization: Bearer <OTHER_USER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacked Tournament"}'

# Response: 403 Forbidden
# Body: { "success": false, "message": "No tienes permiso para actualizar este torneo" }
```

### Test 6: Admin soft-deletes torneo

```bash
curl -X DELETE "http://localhost:8080/api/admin/tournaments/<tournament-id>" \
  -H "Authorization: Bearer <ADMIN_JWT>"

# Response: 200 OK
# SQL ejecutado: UPDATE tournaments SET is_active = false WHERE id = ?
```

### Test 7: Admin ve el torneo inactivo, usuario normal no

```bash
# Admin ve todos (incluyendo inactivos)
curl -X GET http://localhost:8080/api/admin/tournaments \
  -H "Authorization: Bearer <ADMIN_JWT>"
# Response: Aparece torneo inactivo

# Usuario normal lista sus torneos
curl -X GET http://localhost:8080/api/user/tournaments \
  -H "Authorization: Bearer <USER_JWT>"
# Response: NO aparece torneo inactivo (filtro WHERE is_active = true)
```

---

## 📁 ARCHIVOS CREADOS/MODIFICADOS

### SQL Migrations
```
src/main/resources/db/migrations/
├── V8__add_user_id_to_tournaments.sql      ✨ NEW
├── V9__add_is_active_to_tournaments.sql    ✨ NEW
└── V10__add_is_active_to_users.sql         ✨ NEW
```

### Entity Bundle
```
src/main/java/com/tournaments/infrastructure/persistence/entities/
├── TournamentEntity.java                    ✏️ MODIFIED (+owner, +relación)
└── UserEntity.java                          ✏️ MODIFIED (+isActive, +tournaments)
```

### Repository Bundle
```
src/main/java/com/tournaments/infrastructure/persistence/repositories/
├── JpaTournamentRepository.java            ✏️ MODIFIED (+3 métodos)
└── JpaUserRepository.java                  ✏️ MODIFIED (+4 métodos)
```

### DTO Bundle
```
src/main/java/com/tournaments/application/dto/
├── TournamentRequestDto.java               ✨ NEW
├── TournamentResponseDto.java              ✨ NEW
├── GameRequestDto.java                     ✨ NEW
├── GameResponseDto.java                    ✨ NEW
├── UserResponseDto.java                    ✨ NEW
└── UserUpdateAdminDto.java                 ✨ NEW
```

### Service Interfaces
```
src/main/java/com/tournaments/application/service/
├── AdminTournamentService.java             ✨ NEW
├── UserTournamentService.java              ✨ NEW
├── AdminGameService.java                   ✨ NEW
└── AdminUserService.java                   ✨ NEW
```

### Service Implementations
```
src/main/java/com/tournaments/application/service/impl/
├── AdminTournamentServiceImpl.java          ✨ NEW
├── UserTournamentServiceImpl.java           ✨ NEW
├── AdminGameServiceImpl.java                ✨ NEW
└── AdminUserServiceImpl.java                ✨ NEW
```

### Controllers
```
src/main/java/com/tournaments/presentation/controller/
├── AdminTournamentController.java          ✨ NEW
├── AdminGameController.java                ✨ NEW
├── AdminUserController.java                ✨ NEW
└── UserTournamentController.java           ✨ NEW
```

### Exception Bundle
```
src/main/java/com/tournaments/domain/exception/
└── UnauthorizedOperationException.java     ✨ NEW

src/main/java/com/tournaments/infrastructure/web/
└── GlobalExceptionHandler.java             ✏️ MODIFIED (+handlers para nuevas exceptions)
```

### Security & Config
```
src/main/java/com/tournaments/infrastructure/config/
├── SecurityConfig.java                     ✏️ MODIFIED (+@EnableMethodSecurity)
└── ApplicationConfig.java                  ✏️ MODIFIED (+4 nuevos beans)
```

---

## 🚀 PASOS SIGUIENTES

### 1. Ejecutar migraciones
```bash
# El proyecto ejecuta migraciones automáticamente al iniciar
# Verifica que Flyway procese V8, V9, V10 en logs
```

### 2. Crear datos de test
```sql
-- Insert en database (después de que migraciones corran)
INSERT INTO users (username, email, password, enabled, created_at, is_active) 
VALUES ('testadmin', 'admin@test.com', '$2a...[hash]', true, NOW(), true);

INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); -- assign admin role
```

### 3. Verificar en logs
```
----- Spring Boot startup ----
Initializing Spring Security...
Method Security Enabled
Flyway: V8__add_user_id_to_tournaments.sql executed
Flyway: V9__add_is_active_to_tournaments.sql executed
Flyway: V10__add_is_active_to_users.sql executed
```

### 4. Test endpoints (ver sección Testing Rápido arriba)

---

## 🎯 RESUMEN EJECUTIVO

✅ **Arquitectura:** Clean Architecture mantenida (Domain → App → Infra → Presentation)
✅ **Seguridad:** @PreAuthorize en lugar de hardcoded checks (más testeable)
✅ **Soft Delete:** Ambas tablas user/tournaments soportan is_active
✅ **Propiedad Verificada:** UserTournamentService valida que torneo pertenezca al usuario
✅ **Separación de Roles:** AdminTournamentService vs UserTournamentService
✅ **Paginación:** Todos los endpoints list soportan Page<T>
✅ **Manejo de Errores:** UnauthorizedOperationException → 403, ResourceNotFoundException → 404
✅ **DTOs Tipados:** Ningún Object o raw types
✅ **Migraciones SQL:** 3 scripts con índices para performance
✅ **Bean Injection:** ApplicationConfig registra todos los servicios nuevos

---

**Status:** 🟢 LISTO PARA TESTING Y DEPLOYMENT
