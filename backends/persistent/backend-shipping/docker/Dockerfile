# ============================================================
# STAGE 1: Build
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# Cache de dependencias
COPY package*.json ./
RUN npm ci --omit=dev

# Copia código y build
COPY . .

# ============================================================
# STAGE 2: Runtime
# ============================================================
FROM node:20-alpine

# Non-root user (usar GID/UID diferente para evitar conflictos)
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copiar dependencias desde build stage
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules

# Copiar código fuente
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health || exit 1

# Variables por defecto
ENV NODE_ENV=production
ENV HTTP_PORT=3000

CMD ["node", "server.js"]