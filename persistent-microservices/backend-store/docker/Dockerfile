#Utilizamos la imagen de maven para crear el artefacto desplegable (jar) del proyecto
FROM maven:3.8.6-jdk-11 as maven

#Copiamos el codigo fuente dentro de la imagen
COPY ./src /usr/local/app/src

#Copiamos el pom dentro de la imagen y en la raiz del directorio de la app
COPY ./pom.xml /usr/local/app

#Definimos el directorio de la aplicaciøn
WORKDIR /usr/local/app

#Ejecutamos los comandos clean y package propios de maven para generar el jar,
#saltamos los test para que no de error
RUN mvn clean package -DskipTests


#Partimos ahora de una imagen de java
FROM eclipse-temurin:11-alpine
#Define las variables de ambiente
ENV MYSQL_DB_HOST=mysql-library
ENV MYSQL_DB_PORT=3306
ENV MYSQL_DB_USERNAME=root
ENV MYSQL_DB_PASSWORD=password
ENV RABBITMQ_HOST=rabbitmq
# Copia el jar ejecutable de la imagen auxiliar alias mavn
COPY  --from=maven /usr/local/app/target/backend-store-0.0.1-SNAPSHOT.jar /usr/share/app.jar
# Lanza el ejecutable usando java 
CMD ["java", "-jar", "/usr/share/app.jar"]
# Expone el puerto 8081
EXPOSE 8082