# Comandos para crear imágenes Docker

Ejecutar desde la **raíz del proyecto** (`bookstore-app/`).

## Frontends

### Frontend de Catálogo

```bash
docker build -t frontend-catalog-image -f frontends/frontend-catalog/Dockerfile frontends/frontend-catalog/
```

### Frontend de Reviews

```bash
docker build -t frontend-reviews-image -f frontends/frontend-reviews/Dockerfile frontends/frontend-reviews/
```

### Frontend de Store

```bash
docker build -t frontend-store-image -f frontends/frontend-store/Dockerfile frontends/frontend-store/
```

## Backends sin persistencia

### Backend de Catálogo

```bash
docker build -t backend-catalog-image:simple -f backends/persistent/backend-catalog/Dockerfile backends/persistent/backend-catalog/
```

### Backend de Reviews

```bash
docker build -t backend-reviews-image:simple -f backends/persistent/backend-reviews/Dockerfile backends/persistent/backend-reviews/
```

## Backends con persistencia

### Backend de Catálogo

```bash
docker build -t backend-catalog-image -f backends/persistent/backend-catalog/Dockerfile backends/persistent/backend-catalog/
```

### Backend de Reviews

```bash
docker build -t backend-reviews-image -f backends/persistent/backend-reviews/Dockerfile backends/persistent/backend-reviews/
```

### Backend de Store

```bash
docker build -t backend-store-image -f backends/persistent/backend-store/Dockerfile backends/persistent/backend-store/
```

### Backend de Shipping

```bash
docker build -t backend-shipping-image -f backends/persistent/backend-shipping/Dockerfile backends/persistent/backend-shipping/
```

## Publicar imágenes en Docker Hub

```bash
docker tag backend-catalog-image chaphe/backend-catalog-image:1.2
docker push chaphe/backend-catalog-image:1.2

docker tag backend-reviews-image chaphe/backend-reviews-image:1.2
docker push chaphe/backend-reviews-image:1.2

docker tag backend-store-image chaphe/backend-store-image:1.2
docker push chaphe/backend-store-image:1.2

docker tag backend-shipping-image chaphe/backend-shipping-image:1.2
docker push chaphe/backend-shipping-image:1.2

docker tag frontend-catalog-image chaphe/frontend-catalog-image:1.2
docker push chaphe/frontend-catalog-image:1.2

docker tag frontend-reviews-image chaphe/frontend-reviews-image:1.2
docker push chaphe/frontend-reviews-image:1.2

docker tag frontend-store-image chaphe/frontend-store-image:1.2
docker push chaphe/frontend-store-image:1.2
```
