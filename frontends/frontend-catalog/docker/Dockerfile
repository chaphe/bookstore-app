# ============================================================
# STAGE 1: Build React app
# ============================================================
FROM node:16-alpine AS build

WORKDIR /app

# Cache deps
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ============================================================
# STAGE 2: Runtime nginx
# ============================================================
FROM nginx:1.26-alpine

# Non-root
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Config SPA
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Build output
COPY --from=build /app/dist /usr/share/nginx/html

# Template para runtime config
COPY docker/env.sample.js /usr/share/nginx/html/env.sample.js

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

EXPOSE 80

# Variable por defecto
ENV CATALOG_URL=http://backend-catalog:8081

# Runtime substitution
CMD /bin/sh -c "envsubst '\$CATALOG_URL' < /usr/share/nginx/html/env.sample.js > /usr/share/nginx/html/env.js && exec nginx -g 'daemon off;'"