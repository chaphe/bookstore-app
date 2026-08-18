# Frontends - Librería Virtual

Este directorio contiene los 3 frontends de la aplicación Librería Virtual. Cada frontend se comunica con uno o varios de los backends de la aplicación mediante peticiones HTTP (REST).

| Componente | Stack | Carpeta | Backend(s) al que se conecta |
| --- | --- | --- | --- |
| Catálogo de libros | React 17 + Material UI (Create React App) | [frontend-catalog](frontend-catalog/) | backend-catalog (`:8081`) |
| Reseñas de lectores | Angular 13 + Angular Material | [frontend-reviews](frontend-reviews/) | backend-reviews (`:3000`) |
| Tienda | Angular 14 + PrimeNG | [frontend-store](frontend-store/) | backend-store (`:8082`), backend-reviews (`:3000`), backend-catalog (`:8081`) |

Para ver los detalles de cada frontend consulta el `README.md` de su carpeta:

- [frontend-catalog/README.md](frontend-catalog/README.md)
- [frontend-reviews/README.md](frontend-reviews/README.md)
- [frontend-store/README.md](frontend-store/README.md)

## Instalación de dependencias

Ejecutar el siguiente comando en una terminal dentro de cada una de las carpetas de los frontends:

```
npm install
```

y esperar a que el proceso termine.

## Build de los Frontends

El comando de build compila cada proyecto y guarda el resultado en el directorio `./dist` (los archivos estáticos resultantes son servidos por nginx en la imagen Docker).

### frontend-catalog (React)

```
npm run build
```

> NOTA: dentro del archivo `.env` se encuentra la variable `BUILD_PATH` que indica a React en qué directorio guardar el build.

### frontend-reviews (Angular)

```
npm run build
```

también funciona:

```
ng build
```

> NOTA: dentro de `angular.json` la propiedad `outputPath` de la configuración `build` indica el directorio donde se guardan los archivos compilados (en este proyecto está configurado en `./dist`).

### frontend-store (Angular)

```
npm run build
```

también funciona:

```
ng build
```

> NOTA: dentro de `angular.json` la propiedad `outputPath` de la configuración `build` indica el directorio donde se guardan los archivos compilados (en este proyecto está configurado en `./dist`).