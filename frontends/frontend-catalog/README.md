# frontend-catalog - Frontend Catálogo de Libros

Frontend que muestra el catálogo de libros disponibles en la librería y permite agregar y eliminar libros.

## Stack tecnológico

- React 17
- Material UI (MUI) 5 / Material UI 4
- TypeScript 4
- Create React App 4

## Backend al que se conecta

Se comunica con el backend de catálogo (`backend-catalog`) mediante peticiones REST. La URL base se configura con la variable de entorno `REACT_APP_CATALOG_URL` definida en el archivo `.env`:

```
REACT_APP_CATALOG_URL=http://localhost:8081/api
```

## Ejecución en desarrollo

Instalar dependencias:

```
npm install
```

Iniciar el servidor de desarrollo:

```
npm start
```

La aplicación se abrirá en [http://localhost:3001](http://localhost:3001) (el puerto 3001 se configura en el `.env`). La página se recargará automáticamente al hacer cambios en el código.

## Build de producción

```
npm run build
```

Compila la aplicación y guarda los artefactos en el directorio `./dist` (según la variable `BUILD_PATH` del `.env`). Este directorio es el que sirve la imagen Docker mediante nginx.

## Despliegue en Docker

La imagen Docker construye la aplicación y la sirve con nginx en el puerto 80. Para ver los detalles de despliegue de toda la aplicación consulta [docker/README.md](../../docker/README.md).