# Backends In-Memory (sin persistencia)

Esta variante de los backends no tiene persistencia: los datos se almacenan en memoria RAM y se pierden al detener el servicio. Es la **Fase 1** del proyecto y resulta útil para aprender los conceptos de microservicios sin la complejidad de las bases de datos.

| Componente | Descripción | Stack | Puerto | Carpeta |
| --- | --- | --- | --- | --- |
| **backend-catalog** | Catálogo de libros de la librería | Spring Boot | 8081 | [backend-catalog](backend-catalog/) |
| **backend-reviews** | Reseñas de los lectores | Node + Express | 3000 | [backend-reviews](backend-reviews/) |

Para ver la API completa de cada backend consulta su `README.md`:

- [backend-catalog/README.md](backend-catalog/README.md)
- [backend-reviews/README.md](backend-reviews/README.md)

## Notas

- Al iniciar `backend-catalog` se cargan en memoria algunos libros de ejemplo.
- Al iniciar `backend-reviews` se cargan en memoria algunas reseñas de ejemplo.
- Al reiniciar el servicio, cualquier modificación (agregar/eliminar libros o reseñas) se pierde.