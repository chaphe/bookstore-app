# ============================================================
# STAGE 1: Install dependencies
# ============================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Cache de dependencias: solo package files primero
COPY package*.json ./
RUN npm ci --omit=dev

# ============================================================
# STAGE 2: Runtime
# ============================================================
FROM node:20-alpine

# dumb-init para signal handling correcto (PID 1)
RUN apk add --no-cache dumb-init

WORKDIR /app

# Usuario non-root (node:node ya existe en alpine)
RUN chown -R node:node /app

# Copia solo dependencias desde stage deps
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copia código fuente
COPY --chown=node:node . .

# Variable por defecto (debe sobrescribirse en deploy)
ENV MONGODB_HOST=mongodb-reviews

USER node

EXPOSE 3000

# Health check: endpoint /reviews (GET)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/reviews || exit 1

# dumb-init + node
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]