plugins {
    kotlin("jvm") version "2.3.10"
    application
}

group = "com.sunagatov.memora"
version = "0.1.0-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(25))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.telegram:telegrambots-longpolling:9.2.0")
    implementation("org.telegram:telegrambots-client:9.2.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.20.0")
    implementation("org.slf4j:slf4j-simple:2.0.17")
}

application {
    mainClass.set("com.sunagatov.memora.telegrambot.TelegramBotApplicationKt")
}
