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


## Backend de Tienda (Store Backend)

Este servico se encarga de proveer la logica de una librería virtual. Está desarrollado usando Spring y utiliza para la persistencia la base de datos MySQL y para comunicar con el servicio de Entregas (Shipping) el broker de mensajeria RabbitMQ.


## Backend de Entregas (Shipping Backend)

Este servicio se encarga de proveer la información de gestión de la entrega de productos. Es una implementación simple que solo "imprime" esta información en consola. Se comunicar con el servicio de Tienda (Store) el broker de mensajeria RabbitMQ.





