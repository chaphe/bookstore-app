#!/bin/bash
# build-and-push.sh - Build y push de todas las imágenes a Docker Hub
# Uso: ./build-and-push.sh [TAG] [DOCKER_USER]
# Ej: ./build-and-push.sh v1.0.0 miusuario

set -euo pipefail

TAG="${1:-latest}"
DOCKER_USER="${2:-${DOCKER_USER:-}}"

if [[ -z "$DOCKER_USER" ]]; then
  echo "Error: DOCKER_USER no definido."
  echo "Uso: $0 [TAG] [DOCKER_USER]  o  export DOCKER_USER=miusuario"
  exit 1
fi

SERVICES=(
  "backend-catalog:./backends/persistent/backend-catalog:"
  "backend-reviews:./backends/persistent/backend-reviews:./backends/persistent/backend-reviews/docker/Dockerfile"
  "frontend-catalog:./frontends/frontend-catalog:./frontends/frontend-catalog/docker/Dockerfile"
  "frontend-reviews:./frontends/frontend-reviews:./frontends/frontend-reviews/docker/Dockerfile"
  "frontend-store:./frontends/frontend-store:./frontends/frontend-store/docker/Dockerfile"
)

echo "=== Build & Push a Docker Hub (${DOCKER_USER}) ==="
echo "Tag: ${TAG}"

for SVC in "${SERVICES[@]}"; do
  IFS=":" read -r NAME CONTEXT DOCKERFILE <<< "$SVC"
  IMAGE="${DOCKER_USER}/${NAME}:${TAG}"
  
  echo ""
  echo ">>> Building ${IMAGE} ..."
  if [[ -n "$DOCKERFILE" ]]; then
    docker build -f "$DOCKERFILE" -t "$IMAGE" "$CONTEXT"
  else
    docker build -t "$IMAGE" "$CONTEXT"
  fi
  
  echo ">>> Pushing ${IMAGE} ..."
  docker push "$IMAGE"
  
  # Tag latest también
  docker tag "$IMAGE" "${DOCKER_USER}/${NAME}:latest"
  docker push "${DOCKER_USER}/${NAME}:latest"
done

echo ""
echo "=== ¡Completado! Imágenes publicadas ==="
docker images "${DOCKER_USER}/*:${TAG}"