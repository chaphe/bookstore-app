# Despliegue de la aplicación con Docker

## Tabla de contenidos

- [Estructura de archivos](#estructura-de-archivos)
- [Despliegue manual con Docker](#despliegue-manual-con-docker)
  - [Creación de la red](#creación-de-la-red)
  - [Despliegue de Frontends](#despliegue-de-frontends)
  - [Despliegue de Backends sin persistencia](#despliegue-de-backends-sin-persistencia)
  - [Despliegue de Backends con persistencia](#despliegue-de-backends-con-persistencia)
- [Despliegue con Docker Compose (monolítico)](#despliegue-con-docker-compose-monolítico)
  - [Opción 1: Imágenes pre-construidas](#opción-1-imágenes-pre-construidas)
  - [Opción 2: Build desde código fuente](#opción-2-build-desde-código-fuente)
- [Despliegue con Docker Compose (paso a paso)](#despliegue-con-docker-compose-paso-a-paso)

---

## Estructura de archivos

```
docker/
├── docker-compose.yml               # Monolítico con imágenes pre-construidas (Docker Hub)
├── docker-compose-build.yml         # Monolítico con build desde código fuente
├── docker-compose-db.yml            # Paso 1: Solo bases de datos
├── docker-compose-backends.yml      # Paso 2: Solo backends
├── docker-compose-frontends.yml     # Paso 3: Solo frontends
├── create-images.md                 # Comandos para crear imágenes Docker
└── README.md                        # Este archivo
```

---

## Despliegue manual con Docker

Para desplegar la aplicación manualmente es necesario primero crear las imágenes Docker. Ver [create-images.md](create-images.md) para los comandos de build.

### Creación de la red

```bash
docker network create bookstore-network
```

### Despliegue de Frontends

#### Frontend de Catálogo

```bash
docker run --name frontend-catalog --network=bookstore-network -d -p 8080:80 frontend-catalog-image
```

Acceder a [http://localhost:8080](http://localhost:8080)

#### Frontend de Reviews

```bash
docker run --name frontend-reviews --network=bookstore-network -d -p 8082:80 frontend-reviews-image
```

Acceder a [http://localhost:8082](http://localhost:8082)

#### Frontend de Store

```bash
docker run --name frontend-store --network=bookstore-network -d -p 8083:80 frontend-store-image
```

Acceder a [http://localhost:8083](http://localhost:8083)

### Despliegue de Backends sin persistencia

#### Backend de Reviews

```bash
docker run --name backend-reviews --network=bookstore-network -d -p 3000:3000 backend-reviews-image
```

Acceder a [http://localhost:3000/reviews](http://localhost:3000/reviews)

#### Backend de Catálogo

```bash
docker run --name backend-catalog --network=bookstore-network -d -p 8081:8081 backend-catalog-image
```

Acceder a [http://localhost:8081/api/getlibros](http://localhost:8081/api/getlibros)

### Despliegue de Backends con persistencia

#### Backend de Catálogo

Primero desplegar MySQL:

```bash
# Con volumen anónimo
docker run --name mysql-catalog --network=bookstore-network -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0

# O con volumen nombrado (recomendado)
docker run --name mysql-catalog --network=bookstore-network -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d -v mysql-catalog-data:/var/lib/mysql mysql:8.0
```

Ejecutar el script `backends/persistent/catalog-script.sql` usando un cliente MySQL (user=root, password=password).

Desplegar el backend:

```bash
docker run --name backend-catalog --network=bookstore-network -d -p 8081:8081 backend-catalog-image
```

#### Backend de Reviews

Primero desplegar MongoDB:

```bash
# Con volumen anónimo
docker run --name mongodb-reviews --network=bookstore-network -d -p 27017:27017 mongo:7.0

# O con volumen nombrado (recomendado)
docker run --name mongodb-reviews --network=bookstore-network -d -p 27017:27017 -v mongodb-reviews-data:/data/db mongo:7.0
```

Ejecutar `node Initialmongodb.js` para crear y poblar la base de datos.

Desplegar el backend:

```bash
docker run --name backend-reviews --network=bookstore-network -e MONGODB_HOST=mongodb-reviews -d -p 3000:3000 backend-reviews-image
```

#### Backend de Store

```bash
docker run --name backend-store --network=bookstore-network -d -p 8084:8082 backend-store-image
```

#### Backend de Shipping

```bash
docker run --name backend-shipping --network=bookstore-network -d -p 8085:3000 backend-shipping-image
```

---

## Despliegue con Docker Compose (monolítico)

Ejecutar todos los servicios de una sola vez. Ejecutar desde el directorio `docker/`.

### Opción 1: Imágenes pre-construidas

Usa imágenes publicadas en Docker Hub. No requiere build previo.

```bash
docker compose -f docker-compose.yml -p bookstore up -d
```

Verificar el estado:

```bash
docker compose -p bookstore ps
```

Detener:

```bash
docker compose -p bookstore down
```

### Opción 2: Build desde código fuente

Construye las imágenes a partir del código fuente. Requiere tiempo para el primer build.

```bash
docker compose -f docker-compose-build.yml -p bookstore up -d --build
```

Detener:

```bash
docker compose -p bookstore down
```

---

## Despliegue con Docker Compose (paso a paso)

Enfoque educativo para entender el despliegue por capas. Ejecutar desde el directorio `docker/`.

### Paso 1: Desplegar bases de datos

```bash
docker compose -f docker-compose-db.yml -p bookstore up -d
```

Verificar que los contenedores estén saludables:

```bash
docker compose -p bookstore ps
```

Una vez desplegadas las bases de datos, inicializarlas:
- **MySQL**: Ejecutar el script `backends/persistent/catalog-script.sql` con un cliente MySQL.
- **MongoDB**: Ejecutar `node Initialmongodb.js` desde `backends/persistent/`.

### Paso 2: Desplegar backends

```bash
docker compose -f docker-compose-backends.yml -p bookstore up -d
```

Verificar que los backends estén respondiendo:

```bash
curl http://localhost:8081/api/getlibros    # Backend Catalog
curl http://localhost:3000/reviews          # Backend Reviews
```

### Paso 3: Desplegar frontends

```bash
docker compose -f docker-compose-frontends.yml -p bookstore up -d
```

### URLs de acceso

| Servicio | URL |
|---|---|
| Frontend Catálogo | [http://localhost:8080](http://localhost:8080) |
| Frontend Reviews | [http://localhost:8082](http://localhost:8082) |
| Frontend Store | [http://localhost:8083](http://localhost:8083) |
| Backend Catálogo | [http://localhost:8081/api/getlibros](http://localhost:8081/api/getlibros) |
| Backend Reviews | [http://localhost:3000/reviews](http://localhost:3000/reviews) |
| Backend Store | [http://localhost:8084/api/health](http://localhost:8084/api/health) |
| Backend Shipping | [http://localhost:8085/health](http://localhost:8085/health) |
| RabbitMQ Management | [http://localhost:15672](http://localhost:15672) (guest/guest) |
| MySQL | localhost:3306 (root/password) |
| MongoDB | localhost:27017 |

### Detener todo

```bash
docker compose -p bookstore down
```

Para eliminar también los volúmenes:

```bash
docker compose -p bookstore down -v
```
