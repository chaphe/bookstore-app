# Backends - Librería Virtual

Este directorio contiene los backends (microservicios) de la aplicación Librería Virtual. Existen dos variantes:

| Variante | Persistencia | Stack | Carpeta |
| --- | --- | --- | --- |
| **In-memory** | No (los datos se guardan en memoria RAM y se pierden al reiniciar) | Spring Boot / Node + Express | [in-memory](in-memory/) |
| **Persistente** | Sí (bases de datos MySQL / MongoDB) | Spring Boot / Node + Express | [persistent](persistent/) |

## Componentes

| Componente | Descripción | Carpeta |
| --- | --- | --- |
| **backend-catalog** | Catálogo de libros de la librería | [in-memory](in-memory/backend-catalog/) / [persistent](persistent/backend-catalog/) |
| **backend-reviews** | Reseñas de los lectores | [in-memory](in-memory/backend-reviews/) / [persistent](persistent/backend-reviews/) |
| **backend-store** | Tienda: lógica del carrito de compras (solo versión persistente) | [persistent](persistent/backend-store/) |
| **backend-shipping** | Servicio de entrega de los libros comprados (solo versión persistente) | [persistent](persistent/backend-shipping/) |

Para ver la API completa de cada backend consulta su `README.md`:

- [in-memory/README.md](in-memory/README.md)
- [persistent/README.md](persistent/README.md)

---

## Backend de Catálogo (Catalog Backend)

Este servicio brinda información de los libros existentes en el inventario de la librería. Está desarrollado usando Spring y la versión persistente usa base de datos MySQL.

El API es el siguiente:

**GET /api/getlibros**

Retorna la lista de los libros existentes en el catálogo (inventario) en formato JSON:

```
[{"titulo":"The Ultimate Beginners Guide to Learn Docker Step-By-Step","autor":"Mark Reed","descripcion":"Libro para aprender docker","valor":"8","unidades":12,"isbn":"0321299999"},{"titulo":"Se tu propio jefe en 12 meses","autor":"Melinda Emerson","descripcion":"¿Cuántas veces has soñado con abrir tu empresa y ser tu propio jefe? ","valor":"0.5","unidades":900,"isbn":"03213128888"},{"titulo":"El arte de la programacion: introduccion a la informática.","autor":"Leonel Parra","descripcion":"Introduccion a la informatica mediante la progamacion en C++","valor":"15","unidades":50,"isbn":"10010090321"}]
```

**POST /api/agregarlibro** (versión in-memory)

Agrega un nuevo libro al catálogo. Los siguientes parámetros son necesarios: `titulo`, `isbn`, `autor`, `resena`, `valor`, `unidades`

**POST /api/libro** (versión persistente)

Agrega un nuevo libro al catálogo. El cuerpo de la petición debe ser un objeto JSON con los campos del libro (`titulo`, `isbn`, `autor`, `descripcion`, `valor`, `unidades`).

**PUT /api/libro** (versión persistente)

Actualiza un libro existente en el catálogo. El cuerpo de la petición debe ser un objeto JSON con los campos del libro.

**DELETE /api/deletelibro**

Elimina un libro del catálogo. El parámetro necesario es: `ISBN`

## Backend de Reseñas (Reviews Backend)

Este servicio brinda información de las reseñas que han hecho los lectores a diferentes libros. Está desarrollado usando NodeJS + Express y la versión persistente usa MongoDB.

El API es el siguiente:

**GET /reviews**

Retorna la lista de reviews en formato JSON:

```
[{"usuario":"Juan","isbn":"12384776583","estrellas":4,"comentario":"Un libro bueno para distraer el pensamiento"},{"usuario":"Pedro","isbn":"12384776583","estrellas":5,"comentario":"Excelente lectura, muy recomendada"},{"usuario":"Pechocha","isbn":"5768398484932","estrellas":5,"comentario":"Un libro inspirador, recomendado para mejorar tus días"}]
```

**POST /addreviews**

Agrega una nueva reseña o actualiza una reseña existente. Los siguientes parámetros son necesarios: `usuario`, `isbn`, `estrellas`, `comentario`:

```
http://host:port/addreviews?usuario=Pechocha&isbn=5768398484932&estrellas=5&comentario=Un libro inspirador, recomendado para mejorar tus días
```

**DELETE /deletereviews**

Elimina una reseña existente. Los siguientes parámetros son necesarios: `usuario`, `isbn`

## Backend de Tienda (Store Backend)

Este servicio se encarga de proveer la lógica de una librería virtual. Está desarrollado usando Spring y utiliza para la persistencia la base de datos MySQL y para comunicarse con el servicio de Entregas (Shipping) el broker de mensajería RabbitMQ.

El API es el siguiente:

**GET /api/getcart**

Retorna la lista de items que hay en el carrito de compras en formato JSON. El parámetro necesario es: `usuario`:

```
[{"id":"4","usuario":"student","isbn":"10010090321","cantidad":1},{"id":"5","usuario":"student","isbn":"03213128888","cantidad":1}]
```

**POST /api/addcart**

Agrega un libro al carrito de compras. Los siguientes parámetros son necesarios: `usuario`, `isbn`, `cantidad`

**DELETE /api/deletecart**

Elimina un libro del carrito de compras. Los siguientes parámetros son necesarios: `usuario`, `isbn`

**POST /api/buycart**

Realiza la compra de los libros y envía a través de RabbitMQ un mensaje al microservicio de Entrega (Shipping); luego el carrito de compras es vaciado. El parámetro necesario es: `usuario`

## Backend de Entregas (Shipping Backend)

Este servicio se encarga de proveer la información de gestión de la entrega de productos. Es una implementación simple que solo "imprime" la información de la compra en la consola. Para comunicarse con el servicio de Tienda (Store) usa el broker de mensajería RabbitMQ. No expone API HTTP, consume los mensajes de la cola `cartshop`.