FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./
COPY vite.config.js ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto 5173
EXPOSE 5173

# ✅ VARIABLE para activar el proxy de Docker
ENV DOCKER_ENV=true

# Ejecutar Vite en dev mode (con proxy activo)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
