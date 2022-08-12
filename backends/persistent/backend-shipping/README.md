# Broker-CartShop

# rabbitmq
crear un contenedor en docker con el comando
```console
docker run --name rabbitmq-cartshop -p 5672:5672 -p 15672:15672 rabbitmq:3.9-management
```
para ejecutar el cosumidor
```console
npm run start
```
el archivo "shopping.txt" es creado para guardar los mensajes enviados al broker.