# ============================================================
# STAGE 1: Build Angular app
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# Cache de dependencias: solo package files primero
COPY package*.json ./
RUN npm ci

# Copia código fuente y build
COPY . .
RUN npm run build

# ============================================================
# STAGE 2: Runtime con nginx
# ============================================================
FROM nginx:1.26-alpine

# Usuario no-root (nginx ya trae usuario nginx:nginx uid 101)
# Aseguramos permisos correctos en /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Config nginx para SPA (try_files $uri $uri/ /index.html)
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Artefactos de build
COPY --from=build /app/dist /usr/share/nginx/html

# Template para sustitución de variables en runtime
COPY docker/env.sample.js /usr/share/nginx/html/assets/env.sample.js

# Health check: nginx responde en "/"
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

EXPOSE 80

# Variable por defecto (debe sobrescribirse en deploy: docker run -e REVIEWS_URL=...)
ENV REVIEWS_URL=http://backend-reviews:3000

# Sustitución de variable + arranque nginx
CMD ["/bin/sh", "-c", "envsubst '\$REVIEWS_URL' < /usr/share/nginx/html/assets/env.sample.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]