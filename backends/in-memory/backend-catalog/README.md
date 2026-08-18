# backend-catalog (in-memory) - Backend Catálogo de Libros

Microservicio encargado del catálogo (inventario) de libros de la librería. Está desarrollado con Spring Boot.

Esta es la versión **in-memory**: los datos se guardan en memoria RAM (un `Hashtable` de Java) y se pierden al reiniciar el servicio. La versión con persistencia se encuentra en [../../persistent/backend-catalog](../../persistent/backend-catalog/README.md).

## Stack tecnológico

- Java 11
- Spring Boot
- Maven

## Ejecución

### Local (con Maven)

```
mvn spring-boot:run
```

El servicio se levanta en el puerto **8081**.

### Con Docker

```
docker build -t backend-catalog-image:simple -f docker/Dockerfile .
docker run --name backend-catalog -p 8081:8081 backend-catalog-image:simple
```

## Datos iniciales

Al iniciar el servicio se cargan en memoria los siguientes libros de ejemplo:

| ISBN | Título | Autor | Valor | Unidades |
| --- | --- | --- | --- | --- |
| 9789584276971 | El milagro metabólico | Carlos Jaramillo | 49 | 10 |
| 9789584295446 | A fuego lento | Paula Hawkins | 59 | 20 |
| 9789585191426 | Silence | Flor M. Salvador | 55 | 15 |

## API

### GET /api/getlibros

Retorna la lista de todos los libros del catálogo en formato JSON.

Respuesta de ejemplo:

```json
[
  {
    "titulo": "El milagro metabólico",
    "autor": "Carlos Jaramillo",
    "descripcion": "En este libro...",
    "valor": "49",
    "unidades": 10,
    "isbn": "9789584276971"
  }
]
```

### POST /api/agregarlibro

Agrega un nuevo libro al catálogo. Los libros se identifican por su `isbn`, por lo que agregar un `isbn` existente lo reemplaza.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `titulo` | string | Sí | Título del libro |
| `ISBN` | string | Sí | ISBN del libro |
| `autor` | string | Sí | Autor del libro |
| `resena` | string | Sí | Reseña/descripción del libro |
| `valor` | string | Sí | Precio del libro |
| `unidades` | integer | Sí | Cantidad de unidades en inventario |

Ejemplo:

```
POST http://localhost:8081/api/agregarlibro?titulo=Mi%20libro&ISBN=1234567890&autor=Autor&resena=Descripcion&valor=20&unidades=5
```

### DELETE /api/deletelibro

Elimina un libro del catálogo según su ISBN.

Parámetros (query params):

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `ISBN` | string | Sí | ISBN del libro a eliminar |

Ejemplo:

```
DELETE http://localhost:8081/api/deletelibro?ISBN=1234567890
```

Si el libro no existe retorna `HTTP 400`; si se elimina correctamente retorna `HTTP 200`.

## CORS

El servicio permite peticiones desde cualquier origen con los métodos `GET`, `POST` y `DELETE`.