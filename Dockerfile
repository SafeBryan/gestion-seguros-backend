# Usa JDK 17 base optimizada
FROM eclipse-temurin:17-jdk-alpine

# Permite el uso de /tmp como volumen
VOLUME /tmp

# Variable para localizar el JAR compilado
ARG JAR_FILE=target/*.jar

# Copia el archivo .jar desde target/
COPY ${JAR_FILE} app.jar

# Ejecuta el JAR
ENTRYPOINT ["java", "-jar", "/app.jar"]
