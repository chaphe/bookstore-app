# backend-store (persistente) - Backend Tienda

Microservicio encargado de la lógica de la tienda virtual: administra el carrito de compras y, al realizar una compra, envía un mensaje al microservicio de entregas (Shipping) a través de RabbitMQ. Está desarrollado con Spring Boot, utiliza MySQL para la persistencia (base de datos `store`) y RabbitMQ como broker de mensajería.

Solo existe la versión **persistente** de este servicio.

## Stack tecnológico

- Java 17
- Spring Boot
- Maven
- MySQL 8
- RabbitMQ
- OpenAPI / Swagger

## Arquitectura

```
frontend-store ──> backend-store ──> MySQL (tabla cart)
                       │
                       └──(RabbitMQ, cola "cartshop")──> backend-shipping
```

## Ejecución

### Requisitos

- Una instancia de MySQL con la base de datos `store` creada e inicializada con el script [store-script.sql](../store-script.sql).
- Un broker de RabbitMQ corriendo.

### Variables de entorno

| Variable | Descripción | Valor por defecto (Dockerfile) |
| --- | --- | --- |
| `MYSQL_DB_HOST` | Host del servidor MySQL | `mysql-library` |
| `MYSQL_DB_PORT` | Puerto del servidor MySQL | `3306` |
| `MYSQL_DB_USERNAME` | Usuario de la base de datos | `root` |
| `MYSQL_DB_PASSWORD` | Contraseña del usuario | `password` |
| `RABBITMQ_HOST` | Host del broker RabbitMQ | `rabbitmq` |

RabbitMQ se conecta además con `spring.rabbitmq.port=5672`, usuario `guest` y contraseña `guest` (configurado en `application.properties`).

### Local (con Maven)

```
mvn spring-boot:run
```

El servicio se levanta en el puerto **8082**.

### Con Docker

```
docker build -t backend-store-image -f docker/Dockerfile .
docker run --name backend-store --network library-network -e MYSQL_DB_HOST=mysql-catalog-store -e MYSQL_DB_PORT=3306 -e MYSQL_DB_USERNAME=root -e MYSQL_DB_PASSWORD=password -e RABBITMQ_HOST=rabbitmq -p 8082:8082 backend-store-image
```

## Documentación de la API (Swagger)

El servicio expone la documentación interactiva de su API (OpenAPI) en:

- Swagger UI: [http://localhost:8082/docs](http://localhost:8082/docs)
- Especificación JSON: [http://localhost:8082/api-docs](http://localhost:8082/api-docs)

## API

Todas las rutas están bajo el prefijo `/api`. El carrito está asociado a un usuario (identificado por su nombre).

### GET /api/getcart

Retorna la lista de items del carrito de compras de un usuario en formato JSON.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `usuario` | string | Sí | Nombre del usuario |

Ejemplo:

```
GET http://localhost:8082/api/getcart?usuario=student
```

Respuesta de ejemplo:

```json
[
  {
    "id": 4,
    "usuario": "student",
    "isbn": "10010090321",
    "cantidad": 1
  },
  {
    "id": 5,
    "usuario": "student",
    "isbn": "03213128888",
    "cantidad": 1
  }
]
```

### POST /api/addcart

Agrega un libro al carrito de compras de un usuario.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `usuario` | string | Sí | Nombre del usuario |
| `isbn` | string | Sí | ISBN del libro a agregar |
| `cantidad` | integer | No (por defecto `1`) | Cantidad del libro |

Ejemplo:

```
POST http://localhost:8082/api/addcart?usuario=student&isbn=10010090321&cantidad=1
```

Respuesta:

```json
{ "status": "OK" }
```

### DELETE /api/deletecart

Elimina un libro del carrito de compras de un usuario.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `usuario` | string | Sí | Nombre del usuario |
| `isbn` | string | Sí | ISBN del libro a eliminar |

Ejemplo:

```
DELETE http://localhost:8082/api/deletecart?usuario=student&isbn=10010090321
```

Respuesta:

```json
{ "status": "OK" }
```

### POST /api/buycart

Realiza la compra de todos los libros del carrito de un usuario: envía el mensaje con la compra al microservicio de entregas (Shipping) a través de RabbitMQ y luego vacía el carrito.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `usuario` | string | Sí | Nombre del usuario |

Ejemplo:

```
POST http://localhost:8082/api/buycart?usuario=student
```

Respuesta:

```json
{ "status": "OK" }
```

Si falla el envío del mensaje a RabbitMQ, retorna:

```json
{ "status": "ERROR" }
```

## Tabla de la base de datos

La tabla `cart` se crea con el script `store-script.sql`:

| Columna | Tipo |
| --- | --- |
| `id` | INTEGER (PK, auto increment) |
| `usuario` | VARCHAR(60) |
| `isbn` | VARCHAR(60) |
| `cantidad` | INTEGER |

## CORS

El servicio permite peticiones desde cualquier origen con los métodos `GET`, `POST` y `DELETE`.