package com.sunagatov.memora.telegrambot

import org.slf4j.LoggerFactory
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer
import org.telegram.telegrambots.meta.api.methods.send.SendMessage
import org.telegram.telegrambots.meta.api.objects.Update
import org.telegram.telegrambots.meta.generics.TelegramClient

class MemoraLongPollingBot(
    private val settings: BotSettings,
    private val telegramClient: TelegramClient,
    private val backendClient: BackendClient
) : LongPollingUpdateConsumer {

    private val logger = LoggerFactory.getLogger(javaClass)

    override fun consume(updates: MutableList<Update>) {
        updates.forEach { update ->
            val message = update.message ?: return@forEach
            val from = message.from ?: return@forEach
            val chatId = message.chatId

            if (from.id != settings.ownerTelegramUserId) {
                logger.warn("Ignoring update from unauthorized Telegram user {}", from.id)
                return@forEach
            }

            try {
                when {
                    !message.text.isNullOrBlank() -> {
                        val accepted = backendClient.sendText(
                            telegramUserId = from.id,
                            telegramChatId = chatId,
                            telegramMessageId = message.messageId.toLong(),
                            text = message.text
                        )

                        telegramClient.execute(
                            SendMessage.builder()
                                .chatId(chatId)
                                .text("Accepted. Processing asynchronously. Mindraft ID: ${accepted.mindraftId}")
                                .build()
                        )
                    }

                    message.voice != null -> {
                        val voice = message.voice
                        val accepted = backendClient.sendVoice(
                            telegramUserId = from.id,
                            telegramChatId = chatId,
                            telegramMessageId = message.messageId.toLong(),
                            fileId = voice.fileId,
                            fileUniqueId = voice.fileUniqueId,
                            durationSeconds = voice.duration
                        )

                        telegramClient.execute(
                            SendMessage.builder()
                                .chatId(chatId)
                                .text("Accepted. Processing asynchronously. Mindraft ID: ${accepted.mindraftId}")
                                .build()
                        )
                    }
                }
            } catch (ex: Exception) {
                logger.error("Failed to process update", ex)
                telegramClient.execute(
                    SendMessage.builder()
                        .chatId(chatId)
                        .text(
                            "Failed to process message. " +
                                "Stage: bot-forwarding. " +
                                "Reason: ${ex.message ?: "unknown error"}"
                        )
                        .build()
                )
            }
        }
    }
}
