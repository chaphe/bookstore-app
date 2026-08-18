# frontend-reviews - Frontend Reseñas de Lectores

Frontend que muestra las reseñas que han hecho los lectores sobre los libros de la librería.

## Stack tecnológico

- Angular 13
- Angular Material 13
- TypeScript 4

## Backend al que se conecta

Se comunica con el backend de reseñas (`backend-reviews`) mediante peticiones REST. La URL base se configura en el archivo `src/assets/env.js`:

```js
(function (window) {
    window['env'] = window['env'] || {};

    // Environment variables
    window['env']['reviewsUrl'] = 'http://localhost:3000';
})(this);
```

Cambia el valor de `reviewsUrl` por la URL de tu backend de reseñas.

## Ejecución en desarrollo

Instalar dependencias:

```
npm install
```

Iniciar el servidor de desarrollo:

```
npm start
```

o bien:

```
ng serve
```

La aplicación se abrirá en [http://localhost:4200](http://localhost:4200). Se recargará automáticamente al hacer cambios en el código fuente.

## Build de producción

```
npm run build
```

o bien:

```
ng build
```

Compila la aplicación y guarda los artefactos en el directorio `./dist` (según la propiedad `outputPath` de `angular.json`). Este directorio es el que sirve la imagen Docker mediante nginx.

## Despliegue en Docker

La imagen Docker construye la aplicación y la sirve con nginx en el puerto 80. Para ver los detalles de despliegue de toda la aplicación consulta [docker/README.md](../../docker/README.md).