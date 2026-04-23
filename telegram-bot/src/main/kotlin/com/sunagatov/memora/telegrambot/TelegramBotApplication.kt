package com.sunagatov.memora.telegrambot

import org.slf4j.LoggerFactory
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient
import org.telegram.telegrambots.longpolling.TelegramBotsLongPollingApplication

fun main() {
    val logger = LoggerFactory.getLogger("MemoraTelegramBot")
    val settings = BotSettings.fromEnvironment()
    val telegramClient = OkHttpTelegramClient(settings.token)
    val backendClient = BackendClient(
        baseUrl = settings.backendBaseUrl,
        ingestToken = settings.backendBotIngestToken
    )

    logger.info("Starting Memora Telegram bot...")

    TelegramBotsLongPollingApplication().use { app ->
        app.registerBot(
            settings.token,
            MemoraLongPollingBot(
                settings = settings,
                telegramClient = telegramClient,
                backendClient = backendClient
            )
        )

        logger.info("Memora Telegram bot is running.")
        Thread.currentThread().join()
    }
}
