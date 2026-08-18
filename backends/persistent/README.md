# Backends Persistentes

Esta variante de los backends tiene **persistencia**: los datos se guardan en bases de datos (MySQL para los backends de Spring y MongoDB para reviews), por lo que sobreviven al reinicio de los servicios. Corresponde a las **Fases 2, 3 y 4** del proyecto.

| Componente | Descripción | Stack | Base de datos | Puerto | Carpeta |
| --- | --- | --- | --- | --- | --- |
| **backend-catalog** | Catálogo de libros | Spring Boot | MySQL (`catalog-library`) | 8081 | [backend-catalog](backend-catalog/) |
| **backend-reviews** | Reseñas de lectores | Node + Express | MongoDB | 3000 | [backend-reviews](backend-reviews/) |
| **backend-store** | Tienda / carrito de compras | Spring Boot | MySQL (`store`) | 8082 | [backend-store](backend-store/) |
| **backend-shipping** | Entrega de libros comprados | Node (consumidor RabbitMQ) | — | — | [backend-shipping](backend-shipping/) |

Para ver la API completa de cada backend consulta su `README.md`:

- [backend-catalog/README.md](backend-catalog/README.md)
- [backend-reviews/README.md](backend-reviews/README.md)
- [backend-store/README.md](backend-store/README.md)
- [backend-shipping/README.md](backend-shipping/README.md)

## Scripts de inicialización de las bases de datos

En este directorio se encuentran los scripts que crean y pueblan las bases de datos:

| Script | Base de datos | Descripción |
| --- | --- | --- |
| [catalog-script.sql](catalog-script.sql) | `catalog-library` (MySQL) | Crea las tablas del catálogo de libros y las puebla con datos de ejemplo |
| [store-script.sql](store-script.sql) | `store` (MySQL) | Crea las tablas del carrito de compras |
| [reviews-script.js](reviews-script.js) | MongoDB | Crea la colección de reseñas y la puebla con datos de ejemplo |

### Cómo se inicializan

- **Con Docker Compose:** el archivo [docker/](../../docker/) monta este directorio en `/docker-entrypoint-initdb.d` de los contenedores de MySQL y MongoDB, por lo que los scripts se ejecutan automáticamente la primera vez que se crean los volúmenes de las bases de datos.
- **MongoDB (manual):** desde la carpeta [backend-reviews](backend-reviews/) se puede ejecutar `npm run initdb` (o `node Initialmongodb.js`).

## Despliegue

Para desplegar toda la aplicación (bases de datos + backends + frontends) de forma sencilla consulta [docker/README.md](../../docker/README.md).