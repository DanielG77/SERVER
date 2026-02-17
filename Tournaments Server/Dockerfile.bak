# ==================== BUILD STAGE ====================
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
# Download dependencies (cache layer)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -Dspring.profiles.active=dev

# ==================== DEVELOPMENT STAGE ====================
FROM eclipse-temurin:21-jdk-alpine AS dev
WORKDIR /app
RUN apk add --no-cache maven
COPY . .
# Expose ports: 8080 for app, 5005 for debug
EXPOSE 8080 5005
# Command for development (hot reload)
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"]

# ==================== PRODUCTION STAGE ====================
FROM eclipse-temurin:21-jre-alpine AS prod
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/actuator/health || exit 1
# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]