package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendClient
import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import org.slf4j.LoggerFactory
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer
import org.telegram.telegrambots.meta.api.methods.send.SendMessage
import org.telegram.telegrambots.meta.api.objects.Update

class MemoraLongPollingBot(
    private val settings: BotSettings,
    private val telegramClient: OkHttpTelegramClient,
    private val backendClient: BackendClient,
    private val startCommandHandler: StartCommandHandler,
    private val updateMapper: TelegramUpdateMapper
) : LongPollingUpdateConsumer {

    private val logger = LoggerFactory.getLogger(MemoraLongPollingBot::class.java)

    override fun consume(updates: MutableList<Update>) {
        updates.forEach(::consumeSingle)
    }

    private fun consumeSingle(update: Update) {
        val message = update.message ?: return
        val from = message.from ?: return
        val chatId = message.chatId.toString()

        if (from.id.toString() != settings.ownerTelegramUserId) {
            logger.warn("Ignoring update from unauthorized Telegram user id={}", from.id)
            return
        }

        val text = message.text?.trim()

        if (text == "/start") {
            telegramClient.execute(
                SendMessage.builder()
                    .chatId(chatId)
                    .text(startCommandHandler.buildMessage())
                    .build()
            )
            return
        }

        val request = updateMapper.toIngestRequest(update)
        if (request == null) {
            telegramClient.execute(
                SendMessage.builder()
                    .chatId(chatId)
                    .text("Unsupported message type for now.")
                    .build()
            )
            return
        }

        try {
            val itemId = backendClient.ingest(request)
            telegramClient.execute(
                SendMessage.builder()
                    .chatId(chatId)
                    .text("Accepted. Processing asynchronously. Item ID: $itemId")
                    .build()
            )
        } catch (exception: Exception) {
            logger.error("Failed to ingest Telegram update", exception)
            telegramClient.execute(
                SendMessage.builder()
                    .chatId(chatId)
                    .text(
                        "Failed to process message. " +
                            "Stage: backend-ingest. " +
                            "Reason: ${exception.message ?: "unknown"}"
                    )
                    .build()
            )
        }
    }
}
