package com.sunagatov.memora.telegrambot

import com.sunagatov.memora.telegrambot.backend.BackendClient
import com.sunagatov.memora.telegrambot.bot.MemoraLongPollingBot
import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
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

    TelegramBotsLongPollingApplication().use { application ->
        application.registerBot(
            settings.token,
            MemoraLongPollingBot(
                settings = settings,
                telegramClient = telegramClient,
                backendClient = backendClient,
                startCommandHandler = StartCommandHandler(),
                updateMapper = TelegramUpdateMapper()
            )
        )

        logger.info("Memora Telegram bot is running.")
        Thread.currentThread().join()
    }
}
