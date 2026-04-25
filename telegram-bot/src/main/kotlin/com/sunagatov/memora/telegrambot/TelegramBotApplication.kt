package com.sunagatov.memora.telegrambot

import com.sunagatov.memora.telegrambot.backend.BackendClient
import com.sunagatov.memora.telegrambot.bot.MemoraLongPollingBot
import com.sunagatov.memora.telegrambot.bot.TelegramClientMessageSender
import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import org.slf4j.LoggerFactory
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient
import org.telegram.telegrambots.longpolling.TelegramBotsLongPollingApplication
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

fun main() {
    val logger = LoggerFactory.getLogger("MemoraTelegramBot")
    val settings = BotSettings.fromEnvironment()
    val telegramClient = OkHttpTelegramClient(settings.token)
    val backendClient = BackendClient(settings = settings)
    val bot = MemoraLongPollingBot(
        settings = settings,
        messageSender = TelegramClientMessageSender(telegramClient),
        backendClient = backendClient,
        updateMapper = TelegramUpdateMapper(),
        startCommandHandler = StartCommandHandler()
    )
    val scheduler = Executors.newSingleThreadScheduledExecutor()

    logger.info("Starting Memora Telegram bot...")

    try {
        TelegramBotsLongPollingApplication().use { application ->
            application.registerBot(settings.token, bot)
            scheduler.scheduleWithFixedDelay(
                { bot.deliverFailureNotifications() },
                settings.failurePollIntervalSeconds,
                settings.failurePollIntervalSeconds,
                TimeUnit.SECONDS
            )

            logger.info("Memora Telegram bot is running.")
            Thread.currentThread().join()
        }
    } finally {
        scheduler.shutdownNow()
    }
}
