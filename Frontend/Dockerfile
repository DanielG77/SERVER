# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar package.json y lockfile
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar todo el código
COPY . .

# Pasar variable de Stripe al build
ARG VITE_STRIPE_KEY
ENV VITE_STRIPE_KEY=$VITE_STRIPE_KEY

# Build con Vite
RUN npm run build

ARG VITE_STRIPE_KEY
ENV VITE_STRIPE_KEY=$VITE_STRIPE_KEY
RUN echo "🔑 Stripe key during build: $VITE_STRIPE_KEY"
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Instalar serve
RUN npm install -g serve

# Copiar solo el build
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 5173

# Comando por defecto
CMD ["serve", "-s", "dist", "-l", "5173"]
