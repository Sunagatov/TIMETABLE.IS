package com.sunagatov.memora.telegrambot.ingest

import org.telegram.telegrambots.meta.api.objects.Update

class TelegramUpdateMapper {

    fun toIngestRequest(update: Update): TelegramIngestRequest? {
        val message = update.message ?: return null
        val from = message.from ?: return null
        val chat = message.chat ?: return null

        return when {
            !message.text.isNullOrBlank() -> TelegramIngestRequest(
                telegramUserId = from.id.toString(),
                telegramChatId = chat.id.toString(),
                telegramMessageId = message.messageId.toString(),
                text = message.text
            )

            message.voice != null -> TelegramIngestRequest(
                telegramUserId = from.id.toString(),
                telegramChatId = chat.id.toString(),
                telegramMessageId = message.messageId.toString(),
                voice = TelegramVoiceMetadata(
                    fileId = message.voice.fileId,
                    fileUniqueId = message.voice.fileUniqueId,
                    durationSeconds = message.voice.duration,
                    mimeType = message.voice.mimeType
                )
            )

            else -> null
        }
    }
}
