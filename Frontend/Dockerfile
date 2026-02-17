# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y lockfile
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar todo el código
COPY . .

# Build con Vite
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copiar build desde builder
COPY --from=builder /app/dist ./dist

# Servir la app con "serve"
RUN npm install -g serve

# Exponer puerto
EXPOSE 5173

# Comando por defecto
CMD ["serve", "-s", "dist", "-l", "5173"]
