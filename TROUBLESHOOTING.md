## ⚠️ POSIBLES AJUSTES Y TROUBLESHOOTING

### 1. ERRORES DE COMPILACIÓN

#### Error: `cannot find symbol JpaGameRepository` en `AdminGameServiceImpl`
**Solución:**
- Verifica que `JpaGameRepository` existe en `infrastructure/persistence/repositories/`
- Si no existe, crea una interfaz simple:
```java
package com.tournaments.infrastructure.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tournaments.infrastructure.persistence.entities.GameEntity;

@Repository
public interface JpaGameRepository extends JpaRepository<GameEntity, Long> {
}
```

#### Error: `cannot find symbol JpaTournamentFormatRepository`
**Solución:**
```java
package com.tournaments.infrastructure.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tournaments.infrastructure.persistence.entities.TournamentFormatEntity;

@Repository
public interface JpaTournamentFormatRepository extends JpaRepository<TournamentFormatEntity, Long> {
}
```

#### Error: `cannot find symbol JpaPlatformRepository`
**Solución:**
```java
package com.tournaments.infrastructure.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tournaments.infrastructure.persistence.entities.PlatformEntity;

@Repository
public interface JpaPlatformRepository extends JpaRepository<PlatformEntity, Long> {
}
```

#### Error: `cannot find symbol JpaRoleRepository`
**Solución:**
```java
package com.tournaments.infrastructure.persistence.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tournaments.infrastructure.persistence.entities.RoleEntity;

@Repository
public interface JpaRoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByName(String name);
}
```

#### Error: `cannot find symbol CustomUserDetails`
**Verificación:**
- Debe existir en `infrastructure/security/CustomUserDetails.java`
- Si no existe, asegúrate de que el casting en controladores es correcto:
```java
// En controladores, en lugar de:
Long userId = ((CustomUserDetails) userDetails).getId();

// Si CustomUserDetails no existe, usa:
// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
// ... manejar diferente
```

---

### 2. ERRORES DE RUNTIME

#### Error: `No qualifying bean of type 'AdminTournamentService'`
**Causa:** ApplicationConfig no está registrando el bean
**Solución:**
- Verifica que ApplicationConfig.java contiene:
```java
@Bean
public AdminTournamentService adminTournamentService(...) {
    return new AdminTournamentServiceImpl(...);
}
```

#### Error: `NullPointerException` en UserTournamentServiceImpl
**Causa:** Relación no cargada entre TournamentEntity y UserEntity
**Solución:**
```java
// En el mapper, asegurate de que owner está cargado:
TournamentEntity tournament = tournamentRepository.findByIdAndOwnerId(id, userId)
    .orElseThrow(...);

// Si lazy loading falla, usa fetchType = FetchType.EAGER en TournamentEntity:
@ManyToOne(fetch = FetchType.EAGER)  // cambiar de LAZY a EAGER si hay issues
@JoinColumn(name = "user_id")
private UserEntity owner;
```

#### Error: SQL Foreign Key Violation
**Causa:** Intentando crear torneo con user_id que no existe
**Solución:**
```java
// En AdminTournamentServiceImpl, la validación ya existe:
UserEntity owner = userRepository.findById(ownerId)
    .orElseThrow(() -> new ResourceNotFoundException(...));
```

#### Error: `UnauthorizedOperationException` no es capturada en GlobalExceptionHandler
**Solución:**
- Verifica que está en GlobalExceptionHandler.java:
```java
@ExceptionHandler(com.tournaments.domain.exception.UnauthorizedOperationException.class)
@ResponseStatus(HttpStatus.FORBIDDEN)
public ResponseEntity<ApiResponse<Void>> handleUnauthorizedOperationException(
        com.tournaments.domain.exception.UnauthorizedOperationException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.error(ex.getMessage()));
}
```

---

### 3. ERRORES DE MIGRACIÓN

#### Error: `Flyway: Migration V8 failed`
**Causa:** Tabla users no existe o columna user_id ya existe
**Solución:**
```sql
-- En V8__add_user_id_to_tournaments.sql, asegurate de usar ADD COLUMN IF NOT EXISTS:
ALTER TABLE tournaments
ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- Si recibe error de FK, verifica que users.id existe:
ALTER TABLE tournaments
ADD CONSTRAINT IF NOT EXISTS fk_tournaments_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
```

#### Error: `Column "user_id" does not exist`
**Causa:** Migración V8 no corrió o no correctamente
**Solución:**
1. Manualmente ejecuta:
```sql
-- Verificar estructura actual
\d tournaments

-- Si user_id no existe, ejecutar migración:
ALTER TABLE tournaments ADD COLUMN user_id BIGINT NOT NULL DEFAULT 1;
ALTER TABLE tournaments ADD CONSTRAINT fk_tournaments_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
CREATE INDEX idx_tournaments_user_id ON tournaments(user_id);
```

2. Limpiar flyway_schema_history y reintentar
```sql
DELETE FROM flyway_schema_history WHERE script LIKE 'V8%';
-- Luego restart application
```

#### Error: `Column "is_active" does not exist`
**Solución:**
```sql
-- Ejecutar manualmente:
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
CREATE INDEX IF NOT EXISTS idx_tournaments_is_active ON tournaments(is_active);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
```

---

### 4. PROBLEMAS CON @PreAuthorize

#### Error: `@PreAuthorize not working, everyone gets access`
**Causa:** `@EnableMethodSecurity` no está en SecurityConfig
**Solución:**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // ← AGREGAR ESTO
public class SecurityConfig {
    ...
}
```

#### Error: `Access Denied` incluso siendo admin
**Causa:** Token JWT no contiene rol ROLE_ADMIN
**Verificación:**
1. Decodifica el token en jwt.io
2. Verifca que claims incluyen: `"roles": ["ROLE_ADMIN"]`
3. Si no, verifica que user en BD tiene rol asignado:
```sql
SELECT u.username, r.name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'testadmin';
-- Debe retornar una fila con name = 'ROLE_ADMIN'
```

---

### 5. PROBLEMAS CON DTOs

#### Error: `Cannot deserialize TournamentRequestDto`
**Causa:** JSON enviado no coincide con estructura esperada
**Solución:**
```json
// CORRECTO:
{
  "name": "Tournament Name",
  "description": "...",
  "status": "open",
  "gameId": 1,
  "tournamentFormatId": 1,
  "priceClient": 100.00,
  "pricePlayer": 10.00,
  "isOnline": true,
  "minPlayers": 4,
  "maxPlayers": 100
}

// INCORRECTO (Pascal case):
{
  "Name": "...",  // Debe ser camelCase
  "PriceClient": 100
}
```

#### Error: `GameResponseDto is null`
**Causa:** Game entity no cargado antes de mapeo
**Solución:**
```java
// En AdminGameServiceImpl.mapToDto():
private GameResponseDto mapToDto(GameEntity entity) {
    if (entity == null) return null;  // Agregar null check
    return new GameResponseDto(
        entity.getId(),
        entity.getName(),
        ...
    );
}
```

---

### 6. PROBLEMAS CON SEGURIDAD

#### Error: NoSuchElementException al extraer CustomUserDetails
**Causa:** @AuthenticationPrincipal es null
**Solución:**
```java
// INCORRECTO (para rutas protegidas):
@GetMapping
@PreAuthorize("hasRole('USER')")
public void method(@AuthenticationPrincipal UserDetails userDetails) {
    // userDetails puede ser null si SecurityContext no está populated
}

// CORRECTO:
@GetMapping
@PreAuthorize("hasRole('USER')")
public void method(@AuthenticationPrincipal UserDetails userDetails) {
    if (userDetails == null) {
        throw new UnauthorizedOperationException("Not authenticated");
    }
    Long userId = ((CustomUserDetails) userDetails).getId();
}

// O MÁS SEGURO:
@GetMapping
@PreAuthorize("hasRole('USER')")
public void method(@AuthenticationPrincipal UserDetails userDetails) {
    if (!(userDetails instanceof CustomUserDetails)) {
        throw new UnauthorizedOperationException("Invalid user details");
    }
    Long userId = ((CustomUserDetails) userDetails).getId();
}
```

#### Error: JWT token expirado
**Causa:** Access token tiene TTL  limitado (default: 1 hora)
**Solución:**
1. Usa refresh token para obtener nuevo token:
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "..."}'
```

2. O extiende duración en application.properties:
```properties
jwt.access-token.expiration=86400000  # 24 horas en ms
```

---

### 7. PROBLEMAS CON RESPUESTAS API

#### Error: `ApiResponse wrapping issues`
**Verificación:**
- El wrapper `ApiResponse<T>` debe estar disponible en presentation/response
- Todos los controladores deben usar:
```java
ResponseEntity.ok(ApiResponse.success(data, "message"))
ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(...))
ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("message"))
```

#### Error: Page no se serializa correctamente
**Solución:**
```java
// En AdminTournamentController:
Page<TournamentResponseDto> tournaments = ...;
// Page<T> debe estar envuelto en ApiResponse:
return ResponseEntity.ok(ApiResponse.success(tournaments, "..."));

// Response será:
{
  "success": true,
  "data": {
    "content": [...],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,  // page number
    "size": 20
  }
}
```

---

### 8. PROBLEMAS CON BASE DE DATOS

#### Error: Foreign Key no existente
**Causa:** Migración V8 no completó correctamente
**Solución:**
```sql
-- Verificar constraints existentes:
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'tournaments';

-- Agregar constraint si falta:
ALTER TABLE tournaments 
ADD CONSTRAINT fk_tournaments_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);
```

#### Error: Index no creado
**Causa:** Migración V8/V9 incompleta
**Solución:**
```sql
-- Crear índices manualmente:
CREATE INDEX idx_tournaments_user_id ON tournaments(user_id);
CREATE INDEX idx_tournaments_is_active ON tournaments(is_active);
CREATE INDEX idx_tournaments_user_id_is_active ON tournaments(user_id, is_active);
CREATE INDEX idx_users_is_active ON users(is_active);
```

---

### 9. PERFORMANCE

#### Query lenta en getUserId de Token
**Causa:** Lazy loading en User → Tournaments
**Solución:**
```java
// En UserTournamentServiceImpl, usar query específica:
Page<TournamentEntity> page = tournamentRepository
    .findByOwnerIdAndIsActive(userId, true, pageable);
// Esta query es optimizada con índice compuesto
```

#### N+1 problem en admin list tournaments
**Causa:** Cada torneo carga Owner, Game, Format, Platforms
**Solución:**
```java
// En AdminTournamentServiceImpl:
// En lugar de:
tournamentRepository.findAll(pageable).map(this::mapToDto);

// Mejor: usar JOIN FETCH (si es un HQL query)
// O aceptar N+1 para casos con pequeño dataset
```

---

### 10. TESTING

#### Postman Error: Invalid token
**Causa:** Token copiado incorrectamente
**Solución:**
```bash
# Guardar token en variable:
export ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"testadmin","password":"adminpass"}' \
  | jq -r '.data.token')

echo $ADMIN_TOKEN  # Verificar
```

#### CORS Error al acceder desde frontend
**Verificación:**
- SecurityConfig debe tener `@EnableWebSecurity` y CORS configuration
- Verifica que response incluye headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

---

### CHECKLIST FINAL ANTES DE DEPLOYMENT

- [ ] Todas las migraciones V8-V10 corrieron sin errores (revisar logs)
- [ ] Todas las entidades JPA compilan sin errores
- [ ] Todos los DTOs se crean/deserializan correctamente
- [ ] Todos los servicios están registrados como beans en ApplicationConfig
- [ ] Los controladores tienen @PreAuthorize correcto
- [ ] GlobalExceptionHandler captura todas las excepciones
- [ ] Test data insertado en base de datos (setup-test-data.sql)
- [ ] Tokens JWT contienen roles correcto (verify en jwt.io)
- [ ] Admin puede acceder /api/admin/**, usuario normal recibe 403
- [ ] Usuario normal no ve torneos inactivos
- [ ] Soft delete funciona (is_active = false)
- [ ] Relación 1-to-many Tournament-User funciona
- [ ] Índices de BD creados para performance
- [ ] CORS headers presentes en responses
- [ ] /api/auth/login, /api/user/tournaments, /api/admin/tournaments funcionan

Si todos los puntos están ✅, entonces implementación está lista para testing completo.
