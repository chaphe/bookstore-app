# Despliegue de la aplicación con Docker

## Tabla de contenidos

- [Estructura de archivos](#estructura-de-archivos)
- [Puertos](#puertos)
- [Despliegue manual con Docker](#despliegue-manual-con-docker)
  - [Creación de la red](#creación-de-la-red)
  - [Despliegue de Frontends](#despliegue-de-frontends)
  - [Despliegue de Backends sin persistencia](#despliegue-de-backends-sin-persistencia)
  - [Despliegue de Backends con persistencia](#despliegue-de-backends-con-persistencia)
- [Despliegue con Docker Compose (monolítico)](#despliegue-con-docker-compose-monolítico)
  - [Opción 1: Imágenes pre-construidas](#opción-1-imágenes-pre-construidas)
  - [Opción 2: Build desde código fuente](#opción-2-build-desde-código-fuente)
- [Despliegue con Docker Compose (paso a paso)](#despliegue-con-docker-compose-paso-a-paso)
- [Proxy inverso con nginx](#proxy-inverso-con-nginx)

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

## Puertos

| Servicio | Puerto Externo | Rango | Descripción |
|---|---|---|---|
| **Backend Catálogo** | 8081 | 808X | API REST (Spring Boot) |
| **Backend Reviews** | 8082 | 808X | API REST (Node.js) |
| **Backend Store** | 8083 | 808X | API REST (Spring Boot) |
| **Backend Shipping** | 8084 | 808X | Health check (Node.js) |
| **Frontend Catálogo** | 8091 | 809X | UI React |
| **Frontend Reviews** | 8092 | 809X | UI Angular |
| **Frontend Store** | 8093 | 809X | UI Angular |
| MySQL | 3306 | - | Base de datos |
| MongoDB | 27017 | - | Base de datos |
| RabbitMQ | 5672/15672 | - | Mensajería |

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
docker run --name frontend-catalog --network=bookstore-network -d -p 8091:80 frontend-catalog-image
```

Acceder a [http://localhost:8091](http://localhost:8091)

#### Frontend de Reviews

```bash
docker run --name frontend-reviews --network=bookstore-network -d -p 8092:80 frontend-reviews-image
```

Acceder a [http://localhost:8092](http://localhost:8092)

#### Frontend de Store

```bash
docker run --name frontend-store --network=bookstore-network -d -p 8093:80 frontend-store-image
```

Acceder a [http://localhost:8093](http://localhost:8093)

### Despliegue de Backends sin persistencia

#### Backend de Reviews

```bash
docker run --name backend-reviews --network=bookstore-network -d -p 8082:3000 backend-reviews-image
```

Acceder a [http://localhost:8082/reviews](http://localhost:8082/reviews)

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
docker run --name backend-reviews --network=bookstore-network -e MONGODB_HOST=mongodb-reviews -d -p 8082:3000 backend-reviews-image
```

#### Backend de Store

```bash
docker run --name backend-store --network=bookstore-network -d -p 8083:8082 backend-store-image
```

#### Backend de Shipping

```bash
docker run --name backend-shipping --network=bookstore-network -d -p 8084:3000 backend-shipping-image
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
curl http://localhost:8082/reviews          # Backend Reviews
```

### Paso 3: Desplegar frontends

```bash
docker compose -f docker-compose-frontends.yml -p bookstore up -d
```

### URLs de acceso

| Servicio | URL | Acceso |
|---|---|---|
| Frontend Catálogo | [http://localhost:8091](http://localhost:8091) | Navegador / Proxy |
| Frontend Reviews | [http://localhost:8092](http://localhost:8092) | Navegador / Proxy |
| Frontend Store | [http://localhost:8093](http://localhost:8093) | Navegador / Proxy |
| Backend Catálogo | [http://localhost:8081/api/getlibros](http://localhost:8081/api/getlibros) | Postman / curl |
| Backend Reviews | [http://localhost:8082/reviews](http://localhost:8082/reviews) | Postman / curl |
| Backend Store | [http://localhost:8083/api/health](http://localhost:8083/api/health) | Postman / curl |
| Backend Shipping | [http://localhost:8084/health](http://localhost:8084/health) | Postman / curl |
| RabbitMQ Management | [http://localhost:15672](http://localhost:15672) | UI Web (guest/guest) |
| MySQL | localhost:3306 | Cliente DB |
| MongoDB | localhost:27017 | Cliente DB |

### Detener todo

```bash
docker compose -p bookstore down
```

Para eliminar también los volúmenes:

```bash
docker compose -p bookstore down -v
```

---

## Proxy inverso con nginx

Cada frontend actúa como proxy inverso para su backend correspondiente. Esto permite que la aplicación funcione desde cualquier IP sin depender de configuración de red.

### Configuración de proxy

| Frontend | Proxy | Backend |
|---|---|---|
| `localhost:8091` | `/api/*` | `backend-catalog:8081/api/*` |
| `localhost:8092` | `/reviews`, `/addreviews`, `/deletereviews` | `backend-reviews:3000` |
| `localhost:8093` | `/catalog/*` | `backend-catalog:8081/api/*` |
| `localhost:8093` | `/store/*` | `backend-store:8082/api/*` |
| `localhost:8093` | `/reviews`, `/addreviews`, `/deletereviews` | `backend-reviews:3000` |

### Acceso desde VM remota

Desde una máquina remota, acceder a los frontends usando la IP de la VM:

```
http://<VM_IP>:8091    # Frontend Catalog
http://<VM_IP>:8092    # Frontend Reviews
http://<VM_IP>:8093    # Frontend Store
```

Los backends también están disponibles directamente para pruebas con Postman o curl:

```
http://<VM_IP>:8081/api/getlibros
http://<VM_IP>:8082/reviews
http://<VM_IP>:8083/api/health
http://<VM_IP>:8084/health
```
