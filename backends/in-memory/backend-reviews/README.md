# backend-reviews (in-memory) - Backend Reseñas de Lectores

Microservicio encargado de las reseñas que los lectores hacen sobre los libros de la librería. Está desarrollado con Node.js + Express.

Esta es la versión **in-memory**: los datos se guardan en memoria RAM (un arreglo en el código) y se pierden al reiniciar el servicio. La versión con persistencia se encuentra en [../../persistent/backend-reviews](../../persistent/backend-reviews/README.md).

## Stack tecnológico

- Node.js
- Express 4

## Ejecución

### Local (con Node)

```
npm install
npm start
```

El servicio se levanta en el puerto **3000**.

### Con Docker

```
docker build -t backend-reviews-image:simple -f docker/Dockerfile .
docker run --name backend-reviews -p 3000:3000 backend-reviews-image:simple
```

## Datos iniciales

Al iniciar el servicio se cargan en memoria las siguientes reseñas de ejemplo:

```json
[
  {
    "usuario": "mannulus",
    "isbn": "000001222",
    "estrellas": 0,
    "comentario": "no es muy bueno, muy aburrido, perfiero una pelicula"
  },
  {
    "usuario": "chaphe",
    "isbn": "758001222",
    "estrellas": 5,
    "comentario": "sin palabras.... excelente obra, me encanta, la leo todo el tiempo"
  }
]
```

## API

### GET /reviews

Retorna la lista de todas las reseñas en formato JSON.

Respuesta de ejemplo:

```json
[
  {
    "usuario": "mannulus",
    "isbn": "000001222",
    "estrellas": 0,
    "comentario": "no es muy bueno, muy aburrido, perfiero una pelicula"
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
POST http://localhost:3000/addreviews?usuario=Pechocha&isbn=5768398484932&estrellas=5&comentario=Un%20libro%20inspirador
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
DELETE http://localhost:3000/deletereviews?usuario=Pechocha&isbn=5768398484932
```

Respuesta:

```json
{ "code": "OK" }
```

## CORS

El servicio permite peticiones desde cualquier origen (usa el paquete `cors`).