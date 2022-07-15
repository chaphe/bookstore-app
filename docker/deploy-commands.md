# Despliegue de la aplicación


## creacion de la red para catalogo
```
docker network create library-network
```

## Despliegue de los Frontends

### despliegue del frontend de catalogo
```
docker run --name fronted-catalog --network=library-network -d -p 81:80 frontend-catalog-image
```

### despliegue del frontend de reviews
```
docker run --name fronted-reviews --network=library-network  -d -p 82:80 frontend-reviews-image
```

### despliegue del frontend de store
```
docker run --name fronted-store --network=library-network -d -p 80:80 frontend-store-image
```

## Despliegue de los Backends sin persistencia

## despliegue del contenedor backend de reviews
```
docker run --name backend-reviews --network=library-network -d -p 3000:3000 backend-reviews-image:simple
```

## despliegue del contenedor backend de catalogo sin persistencia
```
docker run --name backend-catalog --network=library-network -d -p 8081:8081 backend-catalog-image:simple
```


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

### despliegue del backend de reviews con persistencia

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

### despliegue del backend de store con persistencia

```
docker run --name backend-store --network=library-network -d -p 8082:8082 backend-store-image
```