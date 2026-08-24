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

EXPOSE 8081

# Health check: endpoint GET /api/getlibros
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -q --spider http://localhost:8081/api/getlibros || exit 1

# Vars por defecto (sobrescribir en deploy)
ENV MYSQL_DB_HOST=mysql-catalog
ENV MYSQL_DB_PORT=3306
ENV MYSQL_DB_USERNAME=root
ENV MYSQL_DB_PASSWORD=password

ENTRYPOINT ["java", "-jar", "/app/app.jar"]