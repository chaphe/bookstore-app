# Book Store App - Backends

## Backend de Reseñas (Reviews Backend) 

Este servicio brinda información de las reseñas que han hecho los lectores a diferentes libros. Está desarrollado usando NodeJS + Express y la versión persistente con MongoDB.  

EL API es el siguiente:

**GET /reviews**  
retorna la lista de reviews en formato JSON
```
["usuario":"Juan","isbn":"12384776583","estrellas":4,"comentario":"Un libro bueno para distraer el pensamiento"},{"usuario":"Pedro","isbn":"12384776583","estrellas":5,"comentario":"Excelente lectura, muy recomendada"},{"usuario":"Pechocha","isbn":"5768398484932","estrellas":5,"comentario":"Un libro inspirador, recomendado para mejorar tus días"}]
```

**POST /addreviews**   
Agrega una nueva reseña o actualiza una reseña existente.  
Los siguientes parametros son necesarios : usuario, isbn, estrellas: comentario
```
http://host:port/addreviews?usuario=Pechocha&isbn=5768398484932&estrellas=5&comentario=Un libro inspirador, recomendado para mejorar tus días
```

**DELETE /deletereviews**  
Elimina una reseña existente.  
Los siguientes parametros es necesario : isbn


## Backend de Catalogo (Catalog Backend)

Este servicio brinda información de los libros existentes en el inventario de la liberia. Está desarrollado usando Spring y la versión persistente con base de datos MySQL.  

El API es el siguiente:

**GET /api/getlibros**  
Retorna la lista de los libros existentes en el catalogo (inventario) en formato JSON
```
[{"titulo":"The Ultimate Beginners Guide to Learn Docker Step-By-Step","autor":"Mark Reed","descripcion":"Libro para aprender docker","valor":"8","unidades":12,"isbn":"0321299999"},{"titulo":"Se tu propio jefe en 12 meses","autor":"Melinda Emerson","descripcion":"¿Cuántas veces has soñado con abrir tu empresa y ser tu propio jefe? ","valor":"0.5","unidades":900,"isbn":"03213128888"},{"titulo":"El arte de la programacion: introduccion a la informática.","autor":"Leonel Parra","descripcion":"Introduccion a la informatica mediante la progamacion en C++","valor":"15","unidades":50,"isbn":"10010090321"}]
```

**POST /api/agregarlibro**  

Agrega un nuevo libro al catalogo.  
Los siguientes parametros son necesarios : titulo, isbn, autor, descricpcion, valor, unidades

**DELETE /api/deletelibro**  

 Elimina un libro del catalogo.  
Los siguientes parametros son necesarios: isbn

## Backend de Tienda (Store Backend)

Este servico se encarga de proveer la logica de una librería virtual. Está desarrollado usando Spring y utiliza para la persistencia la base de datos MySQL y para comunicar con el servicio de Entregas (Shipping) el broker de mensajeria RabbitMQ.

**GET /api/getcart**  
Retorna la lista de items que hay en el carrito de compras en formato JSON
Los siguientes parametros son necesarios : usuario
```
[{"id":"4","usuario":"student","isbn":"10010090321","cantidad":1},{"id":"5","usuario":"student","isbn":"03213128888","cantidad":1}]
```

**POST /api/addcart**  
Agrega un libro al carrito de compras
Los siguientes parametros son necesarios : usuario, isbn, cantidad

**DELETE /api/delete**  
Elimina un libro del carrito de compras
Los siguientes parametros son necesarios : usuario, isbn

**POST /api/buycart**  
Este metodo realiza la compra de los libros y envia a través de RabbitMQ un mensaje al microservicio de Entrega (Shipping), luego el carrito de compras es vaciado.
Los siguientes parametros son necesarios : usuario

## Backend de Entregas (Shipping Backend)

Este servicio se encarga de proveer la información de gestión de la entrega de productos. Es una implementación simple que solo "imprime" la información de la compra en la consola. Para comunicarse con el servicio de Tienda (Store) usa broker de mensajeria RabbitMQ.





