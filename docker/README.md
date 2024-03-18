- [Despliegue de la aplicación manualmente usando Docker](#despliegue-de-la-aplicación-manualmente-usando-docker)
  - [Creación de la red para la aplicación](#creación-de-la-red-para-la-aplicación)
  - [Despliegue de los Frontends](#despliegue-de-los-frontends)
    - [Frontend de Catalogo](#frontend-de-catalogo)
    - [Frontend de Reviews](#frontend-de-reviews)
    - [Frontend de Store](#frontend-de-store)
  - [Despliegue de los Backends sin Persistencia](#despliegue-de-los-backends-sin-persistencia)
    - [Backend de Reviews](#backend-de-reviews)
    - [Backend de Catalogo](#backend-de-catalogo)
  - [Despliegue de los Backends con persistencia](#despliegue-de-los-backends-con-persistencia)
    - [Backend de Catalogo](#backend-de-catalogo-1)
    - [Backend de Reviews](#backend-de-reviews-1)
    - [Backend de Store](#backend-de-store)
- [Despliegue de la aplicación usando Docker Compose](#despliegue-de-la-aplicación-usando-docker-compose)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Despliegue de la aplicación manualmente usando Docker

Para desplegar la aplicación es necesario primero crear las imagenes Docker de los diferentes Frontends y Backends. Para crear las imagenes se puede revisar el siguiente [documento](create-images.md) 

## Creación de la red para la aplicación
```
docker network create library-network
```
## Despliegue de los Frontends

### Frontend de Catalogo
```
docker run --name fronted-catalog --network=library-network -d -p 81:80 frontend-catalog-image
```
Frontend de Catalogo ir a [http://localhost:81](http://localhost:81) 

### Frontend de Reviews
```
docker run --name fronted-reviews --network=library-network  -d -p 82:80 frontend-reviews-image
```
Frontend de Reviews ir a [http://localhost:82](http://localhost:82)

### Frontend de Store
```
docker run --name fronted-store --network=library-network -d -p 80:80 frontend-store-image
```
Frontend de Store ir a [http://localhost](http://localhost)

## Despliegue de los Backends sin Persistencia

### Backend de Reviews
```
docker run --name backend-reviews --network=library-network -d -p 3000:3000 backend-reviews-image:simple
```
Backend de Reviews ir a [http://localhost:3000/reviews](http://localhost:3000/reviews)

### Backend de Catalogo
```
docker run --name backend-catalog --network=library-network -d -p 8081:8081 backend-catalog-image:simple
```
Backend de Catalogo ir a [http://localhost:8081/api/getlibros](http://localhost:8081/api/getlibros)

## Despliegue de los Backends con persistencia


### Backend de Catalogo

Para empezar hay que desplegar un contenedor con el servicio de base de datos MySQL, para esto tenemos 2 opciones:

1. Con volumen anonimo

```
docker run --name mysql-library --network=library-network -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0.27
```

2. Con volumen identificado

```
docker run --name mysql-library --network=library-network -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d -v mysql-library-vol:/var/lib/mysql mysql:8.0.27
```

Después de desplegar el contenedor mysql es necesario correr los scripts catalog-script.sql y store-script.sql para crear y poblar la base de datos. Para esto se recomienda usar un cliente como HeidiSQL (user=root, password=password).

Una vez ejecutados los scripts podemos desplegar el contenedor del backend del catalogo

```
docker run --name backend-catalog --network=library-network -d -p 8081:8081 backend-catalog-image
```
Backend de Catalogo ir a [http://localhost:8081/api/getlibros](http://localhost:8081/api/getlibros)

### Backend de Reviews

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
docker run --name backend-reviews --network=library-network -e MONGODB_HOST=mongodb-reviews -d -p 3000:3000 backend-reviews-image
```
Backend de Reviews ir a [http://localhost:3000/reviews](http://localhost:3000/reviews)
### Backend de Store

```
docker run --name backend-store --network=library-network -d -p 8082:8082 backend-store-image
```
___

# Despliegue de la aplicación usando Docker Compose

Verificar que los archivos YAML a utilizar está correctamente creados (verificar nombre de las imagenes)

[docker-compose-db.yml](docker-compose-db.yml)
[docker-compose-backends.yml](docker-compose-backends.yml)
[docker-compose-frontends.yml](docker-compose-frontends.yml)

Para usar desplegar la aplicación usando Docker Compose se deben ejecutar tres etapas:

1. Desplegar las bases de datos

```
docker compose -f docker-compose-db.yml -p library up
```
Una ves desplegadas las bases de datos se debe proceder a inicializarlas 

Después de desplegar el contenedor mysql es necesario correr los scripts catalog-script.sql y store-script.sql para crear y poblar la base de datos. Para esto se recomienda usar un cliente como HeidiSQL (user=root, password=password).

Después de desplegar el contenedor MongoDB es necesario correr ```node Initialmongodb.js``` para crear y poblar la base de datos de MongoDB

2. Desplegar los Backends

```
docker compose -f docker-compose-backends.yml -p library up
```

3. Desplegar los Frontends

Configurar [docker-compose-frontends.yml](docker-compose-frontends.yml) con la IP de la maquina de despliegue. 

```
docker compose -f docker-compose-frontends.yml -p library up
```