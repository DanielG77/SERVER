# Dockerización - Guía de Uso

Este proyecto ha sido completamente dockerizado para facilitar el despliegue y desarrollo local.

## Prerrequisitos

- Docker Desktop instalado y corriendo.
- (Opcional) Make o terminal bash/powershell.

## Estructura

- `docker-compose.yml`: Orquestación de servicios (Base de datos, Backend, Frontend).
- `.env.example`: Variables de entorno por defecto.

## Pasos para iniciar (Quickstart)

1. **Configurar entorno**:
   Copia el archivo de ejemplo a `.env` (opcional, docker-compose usará valores por defecto si no existe, pero se recomienda crearlo):
   ```bash
   cp .env.example .env
   # En Windows Powershell:
   # Copy-Item .env.example .env
   ```

2. **Construir y levantar**:
   Ejecuta en la raíz del proyecto:
   ```bash
   docker compose up -d --build
   ```
   Esto compilará el backend (Maven) y el frontend (Node/Vite) y levantará los contenedores.

3. **Verificar servicios**:
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:8081/api (o health check en http://localhost:8081/actuator/health)
   - **Base de Datos**: Puerto 5432 expuesto.

## Comandos Útiles

| Acción | Comando |
|--------|---------|
| Ver logs (backend) | `docker compose logs -f backend` |
| Ver estado | `docker compose ps` |
| Reiniciar servicios | `docker compose restart` |
| Parar y eliminar | `docker compose down` |
| **Limpieza total** (borra BD) | `docker compose down -v` |

## Migraciones de Base de Datos (Flyway)

El backend está configurado para ejecutar automáticamente las migraciones de Flyway al iniciar.
Para verificar que se aplicaron, puedes consultar la tabla `flyway_schema_history` en la base de datos:

```bash
docker compose exec db psql -U postgres -d tournaments_db -c "SELECT count(*) FROM flyway_schema_history;"
```

## Archivos Docker Previos Detectados

Durante la instalación de esta configuración se detectaron y renombraron los siguientes archivos antiguos para evitar conflictos:

- `Tournaments Server/Dockerfile` -> `Tournaments Server/Dockerfile.bak`
- `Tournaments Server/docker-compose.yml` -> `Tournaments Server/docker-compose.yml.bak`
- `Tournaments Server/start-dev.sh` -> `Tournaments Server/start-dev.sh.bak`
- `Tournaments Server/start-prod.sh` -> `Tournaments Server/start-prod.sh.bak`

Se recomienda revisarlos y borrarlos si no contienen información relevante.
