FROM eclipse-temurin:25-jdk AS build

WORKDIR /app

COPY gradlew gradlew.bat build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle

RUN chmod +x gradlew

COPY src ./src

RUN ./gradlew --no-daemon installDist

FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /app/build/install/memora-telegram-bot /app/memora-telegram-bot

ENTRYPOINT ["/app/memora-telegram-bot/bin/memora-telegram-bot"]
