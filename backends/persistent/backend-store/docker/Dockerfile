# ============================================================
# STAGE 1: Build con Maven
# ============================================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Cache de dependencias: solo pom.xml primero
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia código y compila
COPY src ./src
RUN mvn clean package -DskipTests


# ============================================================
# STAGE 2: Runtime
# ============================================================
FROM eclipse-temurin:17-jre-alpine

# Non-root user
RUN addgroup -g 1000 -S appgroup && adduser -u 1000 -S appuser -G appgroup

WORKDIR /app

# Copia JAR (wildcard para no hardcodear versión)
COPY --from=build /app/target/*.jar app.jar

# Permisos
RUN chown appuser:appgroup /app/app.jar

USER appuser

EXPOSE 8082

# Health check: check if port 8082 is listening
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD nc -z localhost 8082 || exit 1

# Force cache invalidation for health check fix
RUN echo "Health check fixed: using nc instead of wget" > /dev/null

# Vars por defecto (sobrescribir en deploy)
ENV MYSQL_DB_HOST=mysql-store
ENV MYSQL_DB_PORT=3306
ENV MYSQL_DB_USERNAME=root
ENV MYSQL_DB_PASSWORD=password
ENV RABBITMQ_HOST=rabbitmq
ENV RABBITMQ_PORT=5672
ENV RABBITMQ_USER=guest
ENV RABBITMQ_PASS=guest
ENV RABBITMQ_EXCHANGE=amq.direct
ENV RABBITMQ_QUEUE=cartshop
ENV RABBITMQ_ROUTINGKEY=cartshop.routingkey

ENTRYPOINT ["java", "-jar", "/app/app.jar"]