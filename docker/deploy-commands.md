- [Despliegue de la manualmente](#despliegue-de-la-manualmente)
  - [Creación de la red para la aplicación](#creación-de-la-red-para-la-aplicación)
  - [Despliegue de los Frontends](#despliegue-de-los-frontends)
    - [despliegue del frontend de catalogo](#despliegue-del-frontend-de-catalogo)
    - [despliegue del frontend de reviews](#despliegue-del-frontend-de-reviews)
    - [despliegue del frontend de store](#despliegue-del-frontend-de-store)
  - [Despliegue de los Backends sin persistencia](#despliegue-de-los-backends-sin-persistencia)
  - [Despliegue del contenedor backend de Reviews](#despliegue-del-contenedor-backend-de-reviews)
  - [despliegue del contenedor backend de Catalogo sin persistencia](#despliegue-del-contenedor-backend-de-catalogo-sin-persistencia)
  - [Despliegue de los Backends con persistencia](#despliegue-de-los-backends-con-persistencia)
    - [despliegue del backend de catalogo con persistencia](#despliegue-del-backend-de-catalogo-con-persistencia)
    - [Despliegue del backend de reviews con persistencia](#despliegue-del-backend-de-reviews-con-persistencia)
    - [despliegue del backend de store con persistencia](#despliegue-del-backend-de-store-con-persistencia)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Despliegue de la manualmente


## Creación de la red para la aplicación
```
docker network create library-network
```
___
## Despliegue de los Frontends

### despliegue del frontend de catalogo
```
docker run --name fronted-catalog --network=library-network -d -p 81:80 frontend-catalog-image
```
Frontend de Catalogo ir a [http://localhost:81](http://localhost:81) 

### despliegue del frontend de reviews
```
docker run --name fronted-reviews --network=library-network  -d -p 82:80 frontend-reviews-image
```
Frontend de Reviews ir a [http://localhost:82](http://localhost:82)

### despliegue del frontend de store
```
docker run --name fronted-store --network=library-network -d -p 80:80 frontend-store-image
```
Frontend de Store ir a [http://localhost](http://localhost)

## Despliegue de los Backends sin persistencia

## Despliegue del contenedor backend de Reviews
```
docker run --name backend-reviews --network=library-network -d -p 3000:3000 backend-reviews-image:simple
```
Backend de Reviews ir a [http://localhost:3000/reviews](http://localhost:3000/reviews)

## despliegue del contenedor backend de Catalogo sin persistencia
```
docker run --name backend-catalog --network=library-network -d -p 8081:8081 backend-catalog-image:simple
```
Backend de Catalogo ir a [http://localhost:8081/api/getlibros](http://localhost:8081/api/getlibros)

## Despliegue de los Backends con persistencia


### despliegue del backend de catalogo con persistencia

Para empezar hay que desplegar un contenedor con el servicio de base de datos MySQL, para esto tenemos 2 opciones:

1. Con volumen anonimo

```
docker run --name mysql-library --network=library-network -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0.27
```

2. Con volumen identificado

```
docker run --name mysql-library --network=library-network -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d -v mysql-library-vol:/var/lib/mysql mysql:8.0.27
```

Después de desplegar el contenedor mysql es necesario correr los scripts MYSQL-catalog-library.sql y MYSQL-store.sql para crear y poblar la base de datos. Para esto se recomienda usar un cliente como HeidiSQL (user=root, password=password).

Una vez ejecutados los scripts podemos desplegar el contenedor del backend del catalogo

```
docker run --name backend-catalog --network=library-network -d -p 8081:8081 backend-catalog-image
```
Backend de Catalogo ir a [http://localhost:8081/api/getlibros](http://localhost:8081/api/getlibros)

### Despliegue del backend de reviews con persistencia

Para empezar hay que desplegar un contenedor con el servicio de base de datos MongoDB, para esto tenemos 2 opciones:

1. Con volumen anonimo

```
docker run --name=mongodb-reviews --network=library-network -d -p 27017:27017 mongo:5.0.5
```

2. Con volumen identificado

```
docker run --name=mongodb-reviews --network=library-network -d -p 27017:27017 -v mongodb-reviews-vol:/data/db mongo:5.0.5
```


Después de desplegar el contenedor MongoDB es necesario correr ```node Initialmongodb.js``` para crear y poblar la base de datos de MongoDB

Una vez ejecutado el script podemos desplegar el contenedor del backend de reviews

```
docker run --name backend-reviews --network=library-network -d -p 3000:3000 backend-reviews-image
```
Backend de Reviews ir a [http://localhost:3000/reviews](http://localhost:3000/reviews)
### despliegue del backend de store con persistencia

```
docker run --name backend-store --network=library-network -d -p 8082:8082 backend-store-image
```