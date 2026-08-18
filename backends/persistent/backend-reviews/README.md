# backend-reviews (persistente) - Backend Reseñas de Lectores

Microservicio encargado de las reseñas que los lectores hacen sobre los libros de la librería. Está desarrollado con Node.js + Express y utiliza MongoDB para la persistencia (base de datos `test`, colección de reseñas).

Esta es la versión **persistente**. La versión in-memory (sin base de datos) se encuentra en [../../in-memory/backend-reviews](../../in-memory/backend-reviews/README.md).

## Stack tecnológico

- Node.js
- Express 4
- Mongoose (ODM para MongoDB)
- Swagger (swagger-jsdoc + swagger-ui-express)

## Ejecución

### Requisitos

- Una instancia de MongoDB corriendo (por defecto en `localhost:27017`).

### Variables de entorno

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `MONGODB_HOST` | Host del servidor MongoDB | `localhost` (en el Dockerfile) |
| `PORT` | Puerto del servicio | `3000` |

### Inicialización de la base de datos

Para crear la colección de reseñas y poblarla con datos de ejemplo:

```
npm run initdb
```

(o `node Initialmongodb.js`)

### Local (con Node)

```
npm install
npm start
```

El servicio se levanta en el puerto **3000**.

### Con Docker

```
docker build -t backend-reviews-image -f docker/Dockerfile .
docker run --name backend-reviews --network library-network -e MONGODB_HOST=mongodb-reviews -p 3000:3000 backend-reviews-image
```

## Documentación de la API (Swagger)

El servicio expone la documentación interactiva de su API (OpenAPI) en:

- Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)
- Especificación JSON: [http://localhost:3000/docs.json](http://localhost:3000/docs.json)

## API

### GET /reviews

Retorna la lista de todas las reseñas en formato JSON.

Respuesta de ejemplo:

```json
[
  {
    "_id": "619a1c2b9f4e1a1a2b3c4d5e",
    "usuario": "mannulus",
    "isbn": "9789584295446",
    "estrellas": 2,
    "comentario": "no es muy bueno, muy aburrido, perfiero una pelicula",
    "__v": 0
  }
]
```

### POST /addreviews

Agrega una nueva reseña o actualiza una existente. Una reseña se identifica por la combinación `usuario` + `isbn`: si ya existe se actualiza, si no existe se agrega.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `usuario` | string | Sí | Nombre del usuario que hizo la reseña |
| `isbn` | string | Sí | ISBN del libro reseñado |
| `estrellas` | number | Sí | Calificación en estrellas |
| `comentario` | string | Sí | Comentario de la reseña |

Ejemplo:

```
POST http://localhost:3000/addreviews?usuario=Pechocha&isbn=9789585191426&estrellas=5&comentario=Un%20libro%20inspirador
```

Respuesta:

```json
{ "code": "OK" }
```

### DELETE /deletereviews

Elimina una reseña existente según `usuario` + `isbn`.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `usuario` | string | Sí | Nombre del usuario de la reseña |
| `isbn` | string | Sí | ISBN del libro de la reseña |

Ejemplo:

```
DELETE http://localhost:3000/deletereviews?usuario=Pechocha&isbn=9789585191426
```

Respuesta:

```json
{ "code": "OK" }
```

Si la reseña no existe, retorna:

```json
{ "error": "no existe en la base de datos" }
```

## Modelo de datos

Cada reseña (documento de la colección) tiene la siguiente estructura:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `usuario` | String | Nombre del usuario |
| `isbn` | String | ISBN del libro reseñado |
| `estrellas` | Number | Calificación en estrellas |
| `comentario` | String | Comentario de la reseña |

## CORS

El servicio permite peticiones desde cualquier origen (usa el paquete `cors`).