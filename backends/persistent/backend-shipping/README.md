# backend-shipping (persistente) - Backend Entregas

Microservicio encargado de la gestión de la entrega de los libros comprados en la tienda. Es una implementación simple: **consume los mensajes de compra** enviados por `backend-store` a través de RabbitMQ y los registra en la consola y en el archivo `shopping.txt`.

**Este servicio no expone API HTTP.** La comunicación es asíncrona mediante un broker de mensajería RabbitMQ (cola `cartshop`).

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

Al iniciarse, el servicio queda a la espera de mensajes en la cola `cartshop`:

```
[*] Waiting for messages. To exit press CTRL+C
```

### Con Docker

```
docker build -t backend-shipping-image -f docker/Dockerfile .
docker run --name backend-shipping --network library-network -e RABBITMQ_HOST=rabbitmq backend-shipping-image
```

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