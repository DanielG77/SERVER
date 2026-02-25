# Sistema de Autenticación JWT - Guía de Implementación

## Resumen de Cambios Realizados

### Backend (Spring Boot)

#### 1. **Migraciones SQL (V6__User_ForAuth.sql)**
- ✅ Tabla `refresh_tokens` con campo `revoked` (BOOLEAN DEFAULT FALSE) para blacklist
- ✅ Inserciones de roles base (ROLE_ADMIN, ROLE_CLIENT)
- ✅ Usuario de prueba: admin / admin123 (bcrypt hash)

#### 2. **Entidades de Dominio**
- ✅ `RefreshToken` actualizada con campo `revoked`
- ✅ `RefreshTokenEntity` actualizada con mapeo de `revoked`
- ✅ Mapper automático (MapStruct)

#### 3. **Repositorios**
- ✅ `JpaRefreshTokenRepository` creado con métodos:
  - `findByToken(String token)`
  - `findByUserId(Long userId)`
  - `findByUserIdAndRevokedFalse(Long userId)` 
  - `deleteByUserId()`, `deleteByToken()`
- ✅ `RefreshTokenRepositoryPort` extendido
- ✅ `RefreshTokenRepositoryJpaAdapter` implementado

#### 4. **Servicio RefreshTokenService**
- ✅ `createRefreshToken(User user)` - Genera UUID, establece expiry 7 días
- ✅ `verifyExpiration(RefreshToken)` - Valida que no esté revocado ni expirado
- ✅ `revokeToken(String token)` - Marca como revocado
- ✅ `revokeAllUserTokens(User user)` - Revoca todos los tokens del usuario
- ✅ Inyectado como @Service (bean único)

#### 5. **Controlador AuthController (/api/auth)**
- ✅ `POST /api/auth/login` - Autentica y devuelve access + refresh tokens
- ✅ `POST /api/auth/refresh` - Genera nuevo access token (con rotación de refresh)
- ✅ `POST /api/auth/logout` - Revoca refresh token
- ✅ `POST /api/auth/register` - Registro de usuarios (ya existía)

#### 6. **JwtUtils**
- ✅ Anotado con `@Component` (bean único)
- ✅ Usa `jwt.access-token.expiration` (3600000 ms = 1 hora)
- ✅ Usa `jwt.secret` para firma

#### 7. **JwtAuthFilter**
- ✅ Anotado con `@Component` (bean único)
- ✅ Valida access token en cada petición
- ✅ Establece autenticación en SecurityContext
- ✅ Logea debug info

#### 8. **SecurityConfig**
- ✅ Define `SecurityFilterChain` bean
- ✅ CSRF deshabilitado, CORS habilitado
- ✅ Sesiones stateless
- ✅ Rutas públicas: `/api/auth/**`, `/tournaments/**`, `/genres/**`, `/games/**`
- ✅ Rutas protegidas: `/api/users/**`, `/api/profiles/**`
- ✅ JwtAuthFilter añadido before UsernamePasswordAuthenticationFilter
- ✅ AuthenticationManager bean definido

#### 9. **Configuración de Propiedades**
```properties
jwt.access-token.expiration=3600000      # 1 hora
jwt.refresh-token.expiration=604800000   # 7 días
jwt.secret=7nUKECHD/E0L/HKT1Zj4tUbKLGZtvbcIOQkCCwrbrGc=
```

### Frontend (React + Vite)

#### 1. **AuthContext (src/context/AuthContext.tsx)**
- ✅ Gestiona estado: `user`, `isAuthenticated`, `loading`
- ✅ Almacena tokens en cookies (NO HttpOnly, accesibles desde JavaScript)
- ✅ Cookies con validación `path: '/', sameSite: 'Lax'`
- ✅ Al cargar la app, revisa cookies y carga perfil si hay token
- ✅ Funciones:
  - `login(credentials)` - Autentica y guarda tokens
  - `logout()` - Revoca en servidor y limpia cookies
  - `refreshAccessToken()` - Obtiene nuevo access token
  - `authFetch(url, options)` - Wrapper de fetch que:
    - Añade header `Authorization: Bearer {token}`
    - Si recibe 401, intenta refrescar token automáticamente
    - Si falla, logout automático

#### 2. **PrivateRoute (src/components/PrivateRoute.tsx)**
- ✅ Protege rutas que requieren autenticación
- ✅ Redirige a `/login` si no está autenticado

#### 3. **Router (src/app/router.tsx)**
- ✅ Ruta `/perfil` protegida con PrivateRoute
- ✅ Ruta `/login` pública

#### 4. **useTournaments Hook**
- ✅ Usa `authFetch` del AuthContext
- ✅ URL relativa `/tournaments?...` (authFetch añade base URL)
- ✅ Manejo automático de 401 + reintento

#### 5. **auth.ts Service**
- ✅ `apiLogin()` - Llama a `/api/auth/login`
- ✅ Respuesta esperada: `{ token, refreshToken, username, email, roles }`
- ✅ Gestión de errores

## Flujo de Autenticación

### 1. Login
```
Usuario → Login form →
→ apiLogin(email, password) →
→ POST /api/auth/login →
→ Backend autentica y devuelve:
  {
    token: "eyJhbG...",          // access token (1 hora)
    refreshToken: "uuid...",     // refresh token (7 días)
    username: "admin",
    email: "admin@example.com",
    roles: ["ROLE_ADMIN"]
  }
→ Frontend guarda en cookies →
→ AuthContext.login() →
→ Redirige a /home
```

### 2. Request con Token
```
authFetch("/api/users/profile") →
→ Headers: { Authorization: "Bearer {access_token}" } →
→ Backend: JwtAuthFilter valida token →
→ Si válido: procesa request →
→ Si 401: Frontend intenta refresh
```

### 3. Refresh Token
```
Si recibe 401 →
→ authFetch detecta 401 →
→ Llama refreshAccessToken() →
→ POST /api/auth/refresh con { refreshToken } →
→ Backend:
  - Valida que no esté revocado ni expirado
  - Genera NUEVO access token
  - Genera NUEVO refresh token (rotación)
  - Revoca el anterior →
→ Frontend actualiza cookies →
→ Reintenta request original con nuevo token
```

### 4. Logout
```
logout() →
→ POST /api/auth/logout con { refreshToken } →
→ Backend revoca el token en BD →
→ Frontend limpia cookies →
→ Redirige a /login
```

## Pruebas Manuales

### 1. Crear usuario de prueba (ya existe)
```sql
-- Usuario: admin
-- Contraseña: admin123 (bcrypt: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG)
-- Email: admin@example.com
-- Rol: ROLE_ADMIN
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'
```

Respuesta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "username": "admin",
  "email": "admin@example.com",
  "roles": ["ROLE_ADMIN"]
}
```

### 3. Usar Access Token
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/users/profile
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"550e8400-e29b-41d4-a716-446655440000"}'
```

Respuesta esperada:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001",  // nuevo token (rotación)
  "tokenType": "Bearer"
}
```

### 5. Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"550e8400-e29b-41d4-a716-446655440001"}'
```

## Configuración Frontend

### Variables de Entorno (opcional)
```env
VITE_API_URL=http://localhost:8080
```

### Cookies en el Navegador
- `access_token` - Expira en 1 hora
- `refresh_token` - Expira en 7 días

### Flujo en React
1. **Al cargar la app**: AuthProvider comprueba si hay access_token en cookies
2. **Si existe**: Intenta cargar perfil del usuario
3. **Si no existe**: Mantiene estado loading=false, user=null
4. **Usuario cliquea login**: Se abre formulario
5. **Después del login**: Se guardan cookies y se establece user
6. **Durante peticiones**: authFetch añade automáticamente el token
7. **Si token expira**: Intenta refrescar automáticamente
8. **En logout**: Limpia cookies y redirige a login

## Notas Importantes

### ✅ Sin Duplicados de Beans
- `JwtUtils`: @Component (único)
- `JwtAuthFilter`: @Component (único)  
- `RefreshTokenService`: @Service (único)
- `SecurityFilterChain`: @Bean en SecurityConfig (único)
- `AuthenticationManager`: @Bean en SecurityConfig (único)
- `CorsConfigurationSource`: @Bean en SecurityConfig (único)

### ✅ Cookies Accesibles
- Las cookies NO tienen HttpOnly (frontend puede acceder)
- secure=false en desarrollo (cambiar a true en producción con HTTPS)
- sameSite=Lax para permitir CORS

### ✅ URLs Base
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173` (Vite default)
- CORS habilitado para cualquier origen en desarrollo

### ⚠️ Pendiente de Implementar
- Endpoint `/api/users/profile` o similar para obtener datos del usuario autenticado
- Posiblemente necesites crear/actualizar este endpoint en UserController

## Próximos Pasos

1. **Crear endpoint de perfil** (si no existe):
```java
@GetMapping("/profile")
@PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
    // Obtener usuario By username
    // Devolver UserDto
}
```

2. **Pruebas en el Frontend**:
   - Abrir DevTools → Application → Cookies
   - Verificar que se crean cookies con tokens
   - Verificar que se limpian al logout
   - Verificar que se refrescan automáticamente

3. **Pruebas de Seguridad**:
   - Modificar token en cookies → debe fallar
   - Esperar a que expire → debe refrescar automáticamente
   - Revocarlo en BDD → debe logout automático

4. **Configuración de Producción**:
   - Cambiar `secure=true` en cookies
   - Cambiar URLs de `http://localhost:8080` a dominio real
   - Ajustar CORS para solo dominios autorizados
   - Habilitar HTTPS
