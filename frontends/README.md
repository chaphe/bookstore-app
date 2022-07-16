
## Instrucciones de instalacion

ejecutar el siguiente comando en una terminal
```
npm install 
```
en cada una de las siguientes carpetas:  
>frontend-catalog-library 

>frontend-reviews 

>backend-reviews

y dejar que el proceso termine

# Iniciar servidores
## backend-reviews 
ejecutar el comando
```
npm run start
```
dentro de la carpeta, para iniciar en el puerto 3000 los servicios de las reseñas.

## backend-library-catalog
ejecutar como un proyecto spring boot. (mvn spring-boot:run)

aqui se encuentra los servicios para la pagina de libros.

## backend-store
ejecutar como un proyecto spring boot. (mvn spring-boot:run).

aqui se encuentra los servicios para la tienda de libros.

# Build Frontend
## frontend-catalog-library
dentro de esta carpeta en una terminal ejecutar 
```
npm run build
```
esto compila el proyecto y lo guarda en ./dist

NOTA: dentro de .env se encuentra BUILD_PATH que le dice a react en que directorio guadarlo.

## frontend-reviews
dentro de esta carpeta en una terminal ejecutar
```
npm run build
```
tambien funciona 
```
ng build
```
NOTA: dentro de angular.json 
```json
"build": {
          ...
          "options": {
              ...
            "outputPath": "./dist"
              ...
          }
```
outputPath indica el directorio donde se guardara los archivos compilados.

