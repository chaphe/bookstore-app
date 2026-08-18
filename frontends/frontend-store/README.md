# frontend-store - Frontend Tienda

Frontend de la tienda virtual de libros: permite consultar el catálogo, ver reseñas de los lectores y administrar el carrito de compras (agregar libros y realizar la compra).

## Stack tecnológico

- Angular 14
- PrimeNG 14 / PrimeFlex
- TypeScript 4 (basado en el template Sakai)

## Backends a los que se conecta

Se comunica con 3 backends mediante peticiones REST. Las URLs base se configuran en el archivo `src/assets/env.js`:

```js
(function (window) {
    window['env'] = window['env'] || {};

    // Environment variables
    window['env']['storeUrl'] = 'http://localhost:8082';
    window['env']['reviewsUrl'] = 'http://localhost:3000';
    window['env']['catalogUrl'] = 'http://localhost:8081';
})(this);
```

| Variable | Backend | Puerto por defecto |
| --- | --- | --- |
| `storeUrl` | backend-store (carrito de compras) | 8082 |
| `reviewsUrl` | backend-reviews (reseñas de lectores) | 3000 |
| `catalogUrl` | backend-catalog (catálogo de libros) | 8081 |

Cambia los valores por las URLs de tus backends.

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