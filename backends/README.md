# Book Store App - Backends

## Backend de reviews

Brinda información de las reseñas que han hecho los lectores a diferentes libros. Está desarrollado usando NodeJS + Express.  
EL API es el siguiente:

**GET /reviews**  
retorna la lista de reviews en formato JSON
```
["usuario":"Juan","isbn":"12384776583","estrellas":4,"comentario":"Un libro bueno para distraer el pensamiento"},{"usuario":"Pedro","isbn":"12384776583","estrellas":5,"comentario":"Excelente lectura, muy recomendada"},{"usuario":"Pechocha","isbn":"5768398484932","estrellas":5,"comentario":"Un libro inspirador, recomendado para mejorar tus días"}]
```

**POST /addreviews**   
Agrega una nueva reseña a la lista.  
Los siguientes parametros son necesarios : usuario, isbn, estrellas: comentario
```
http://host:port/addreviews?usuario=Pechocha&isbn=5768398484932&estrellas=5&comentario=Un libro inspirador, recomendado para mejorar tus días
```


