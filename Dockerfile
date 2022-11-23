FROM openjdk:17-jdk-alpine

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app

COPY env.prod.properties /env.properties
COPY base.prod.js /app/static/js/base.js
COPY keystore.p12 /keystore.p12

ENTRYPOINT ["java","-cp","app:app/lib/*","com.inesantaclaus.Application"]