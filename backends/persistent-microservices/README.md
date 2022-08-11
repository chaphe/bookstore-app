# MYSQL Docker
primero se debe descargar la imagen de mysql para docker, con el comando
```
docker pull mysql
```
luego de terminar de descargar la imagen, para iniciar una contenedor se ejecuta
```
docker run --name mysql-library -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:latest
```
esto asigna el puerto 3306 y el nombre root y password a mysql.

NOTA:para poder conectarse desde un administrador de base de datos como heidisql, se debe garantizar permisos
de acceso remoto a mysql desde el usuario root.

para eso se usa los siguientes comandos desde una terminal de docker
```
# mysql -p
mysql> alter user 'root'@'%' identified with mysql_native_password by 'password';
mysql> flush privileges;
```

# Mongodb Docker
ejecutar el siguiente comando en una terminal, se descarga la imagen de mongodb y se inicia el contenedor
en el puerto 27017 con el nombre "mongodb-reviews".
```
docker run -d -p 27017:27017 --name=mongodb-reviews mongo:latest
```
NOTA: para cargar los datos iniciales de este ejemplo ejecutar dentro de 📁backend-reviews 
```
node ./Initialmongodb.js
```
esto creara la colleccion e insertara los datos.