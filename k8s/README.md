# Despliegue de la applicación en K8s

## Introducción
### Inicializar BDs
Debe tenerse las siguientes consideraciones para realizar el despliegue:
- La base de datos mongo de reviews (llamada test) debe estar creada
- La bases de datos mysql de catalog debe estar creada e inicializada (ver catalog-script.sql)
- La bases de datos mysql de store debe estar creada e inicializada (ver store-script.sql)

Se pueden crear servicios de tipo NodePort para inicializar las BD o hacer un port-forward de esta forma (usar el nombre adecuado)

```
kubectl port-forward -n library-ns service/mysql-catalog-service 13306:3306
```
## Despliegue de la app reviews

Antes de desplegar el archivo reviews.yaml cambiar la propiedad **REVIEWS_URL** en el deployment *reviews-frontend-deployment* 
