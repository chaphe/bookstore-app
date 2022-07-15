# Build commands for Frontends

```
docker build -t frontend-catalog-image -f docker/Dockerfile .
```

```
docker build -t frontend-reviews-image -f docker/Dockerfile .
```

```
docker build -t frontend-store-image -f docker/Dockerfile .
```

# Build commands for Backends without persistence

```
docker build -t backend-catalog-image:simple -f docker/Dockerfile .
```

```
docker build -t backend-reviews-image:simple -f docker/Dockerfile .
```


# Build commands for Backends with persistence

```
docker build -t backend-catalog-image -f docker/Dockerfile .
```
```
docker build -t backend-reviews-image -f docker/Dockerfile .
```
```
docker build -t backend-store-image -f docker/Dockerfile .
```