
# Instrucciones de generación de artefactos de despliegue

## Instalación de dependencias
Ejecutar el siguiente comando en una terminal
```
npm install 
```
en cada una de las siguientes carpetas:  

>frontend-catalog-library 

>frontend-reviews 

>frontend-store

y dejar que el proceso termine


## Build Frontends
### frontend-catalog-library
dentro de esta carpeta en una terminal ejecutar 
```
npm run build
```
esto compila el proyecto y lo guarda en ./dist

NOTA: dentro de .env se encuentra BUILD_PATH que le dice a react en que directorio guadarlo.

### frontend-reviews
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

### frontend-store
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