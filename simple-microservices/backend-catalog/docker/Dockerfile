#FROM openjdk:8-alpine
# Imagen de base openjdk 11, en caso de usar java 8 mirar la primera linea 
# FROM openjdk:11-alpine
FROM eclipse-temurin:11-alpine
# Copia el jar ejecutable
COPY target/backend-catalog-library-0.0.1-SNAPSHOT.jar /usr/share/app.jar
# Lanza el ejecutable usando java 
CMD ["java", "-jar", "/usr/share/app.jar"]
# Expone el puerto 8081
EXPOSE 8081