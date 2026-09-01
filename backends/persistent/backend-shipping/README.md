# backend-shipping (persistente) - Backend Entregas

Microservicio encargado de la gestión de la entrega de los libros comprados en la tienda. **Consume los mensajes de compra** enviados por `backend-store` a través de RabbitMQ (cola `cartshop`), los almacena en una **estructura de datos en memoria** y expone una **API HTTP** para consultar los mensajes recibidos.

La comunicación con `backend-store` es asíncrona mediante un broker de mensajería RabbitMQ (cola `cartshop`).

## Arquitectura

```
backend-store ──(RabbitMQ, cola "cartshop")──> backend-shipping ──> consola / shopping.txt
```

## Stack tecnológico

- Node.js
- amqplib (cliente de RabbitMQ)
- winston (logging)

## Ejecución

### Requisitos

- Un broker de RabbitMQ corriendo.

### Variables de entorno

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `RABBITMQ_HOST` | Host del broker RabbitMQ | `rabbitmq` |

La conexión se realiza con usuario `guest` y contraseña `guest` en el puerto `5672`:

```
amqp://guest:guest@<RABBITMQ_HOST>:5672
```

### Local (con Node)

```
npm install
npm start
```

Al iniciarse, el servicio levanta la API HTTP (puerto `3000` por defecto) y queda a la espera de mensajes en la cola `cartshop`:

```
[*] Waiting for messages. To exit press CTRL+C
```

### Con Docker

```
docker build -t backend-shipping-image -f docker/Dockerfile .
docker run --name backend-shipping --network library-network -e RABBITMQ_HOST=rabbitmq backend-shipping-image
```

## API HTTP

Además de consumir la cola, el servicio expone los siguientes endpoints para consultar los mensajes de compra almacenados en memoria:

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/health` | Estado del servicio y cantidad de mensajes almacenados. |
| `GET` | `/messages` | Lista de todos los mensajes de compra recibidos. Soporta el filtro `?usuario=<usuario>`. |
| `GET` | `/messages/:id` | Detalle de un mensaje concreto (identificado por su `id`). Devuelve `404` si no existe. |

Ejemplo:

```
GET /messages
[
  {
    "usuario": "student",
    "carrito": [ { "id": "4", "usuario": "student", "isbn": "10010090321", "cantidad": 1 } ],
    "id": "1693000000000-ab12cd34",
    "at": "2026-08-27T12:00:00.000Z"
  }
]

GET /messages?usuario=student
GET /messages/1693000000000-ab12cd34
```

> **Nota:** los mensajes se guardan en memoria RAM (no hay persistencia). Se conservan las últimas `MAX_MESSAGES` (por defecto 50); al superar el límite se descarta el más antiguo. Al reiniciar el servicio se pierden.

## Cola RabbitMQ

| Propiedad | Valor |
| --- | --- |
| Cola | `cartshop` |
| Durabilidad | `durable: true` |
| Prefetch | 10 |
| Auto-ack | No (ack manual después de procesar el mensaje) |

## Salida

Cada mensaje recibido (la compra realizada por un usuario en la tienda) se registra con winston en:

- La consola.
- El archivo `shopping.txt` (creado en el directorio de ejecución), en formato JSON.