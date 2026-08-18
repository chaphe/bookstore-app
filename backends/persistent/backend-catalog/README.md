# backend-catalog (persistente) - Backend Catálogo de Libros

Microservicio encargado del catálogo (inventario) de libros de la librería. Está desarrollado con Spring Boot y utiliza MySQL para la persistencia (base de datos `catalog-library`).

Esta es la versión **persistente**. La versión in-memory (sin base de datos) se encuentra en [../../in-memory/backend-catalog](../../in-memory/backend-catalog/README.md).

## Stack tecnológico

- Java 17
- Spring Boot
- Maven
- MySQL 8
- OpenAPI / Swagger

## Ejecución

### Requisitos

- Una instancia de MySQL con la base de datos `catalog-library` creada e inicializada con el script [catalog-script.sql](../catalog-script.sql).

### Variables de entorno

| Variable | Descripción | Valor por defecto (Dockerfile) |
| --- | --- | --- |
| `MYSQL_DB_HOST` | Host del servidor MySQL | `mysql-library` |
| `MYSQL_DB_PORT` | Puerto del servidor MySQL | `3306` |
| `MYSQL_DB_USERNAME` | Usuario de la base de datos | `root` |
| `MYSQL_DB_PASSWORD` | Contraseña del usuario | `password` |

### Local (con Maven)

```
mvn spring-boot:run
```

El servicio se levanta en el puerto **8081**.

### Con Docker

```
docker build -t backend-catalog-image -f docker/Dockerfile .
docker run --name backend-catalog --network library-network -e MYSQL_DB_HOST=mysql-catalog-store -e MYSQL_DB_PORT=3306 -e MYSQL_DB_USERNAME=root -e MYSQL_DB_PASSWORD=password -p 8081:8081 backend-catalog-image
```

## Documentación de la API (Swagger)

El servicio expone la documentación interactiva de su API (OpenAPI) en:

- Swagger UI: [http://localhost:8081/docs](http://localhost:8081/docs)
- Especificación JSON: [http://localhost:8081/api-docs](http://localhost:8081/api-docs)

## API

Todas las rutas están bajo el prefijo `/api`.

### GET /api/getlibros

Retorna la lista de todos los libros del catálogo en formato JSON.

Respuesta de ejemplo:

```json
[
  {
    "ISBN": "9789585579668",
    "titulo": "Foundation",
    "autor": "Isaac Asimov",
    "descripcion": "The Foundation series is a science fiction book series...",
    "valor": "12.99",
    "unidades": 10
  }
]
```

### POST /api/libro

Agrega un nuevo libro al catálogo. Si el `ISBN` ya existe, lo reemplaza.

Cuerpo de la petición (JSON):

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ISBN` | string | ISBN del libro (identificador único) |
| `titulo` | string | Título del libro |
| `autor` | string | Autor del libro |
| `descripcion` | string | Descripción/reseña del libro |
| `valor` | string | Precio del libro |
| `unidades` | integer | Cantidad de unidades en inventario |

Ejemplo:

```
POST http://localhost:8081/api/libro
Content-Type: application/json

{
  "ISBN": "9789585579668",
  "titulo": "Foundation",
  "autor": "Isaac Asimov",
  "descripcion": "The Foundation series is a science fiction book series.",
  "valor": "12.99",
  "unidades": 10
}
```

### PUT /api/libro

Actualiza un libro existente en el catálogo. El `ISBN` del cuerpo identifica el libro a actualizar.

Cuerpo de la petición (JSON): igual que en `POST /api/libro`.

### DELETE /api/deletelibro

Elimina un libro del catálogo según su ISBN.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `ISBN` | string | Sí | ISBN del libro a eliminar |

Ejemplo:

```
DELETE http://localhost:8081/api/deletelibro?ISBN=9789585579668
```

## Tabla de la base de datos

La tabla `Book` se crea con el script `catalog-script.sql`:

| Columna | Tipo |
| --- | --- |
| `titulo` | VARCHAR(60) |
| `ISBN` | VARCHAR(60) (PK) |
| `autor` | VARCHAR(60) |
| `descripcion` | VARCHAR(250) |
| `valor` | VARCHAR(60) |
| `unidades` | INT |

## CORS

El servicio permite peticiones desde cualquier origen con los métodos `GET`, `POST`, `PUT` y `DELETE`.