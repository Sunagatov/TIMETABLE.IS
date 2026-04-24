package com.sunagatov.memora.telegrambot.ingest

import org.telegram.telegrambots.meta.api.objects.Update

class TelegramUpdateMapper {

    fun toTextIngestRequest(update: Update): TelegramIngestRequest? {
        val message = update.message ?: return null
        val from = message.from ?: return null
        val chat = message.chat ?: return null
        val text = message.text ?: return null
        if (text.isBlank()) {
            return null
        }

        return TelegramIngestRequest(
            telegramUserId = from.id.toString(),
            telegramChatId = chat.id.toString(),
            telegramMessageId = message.messageId.toString(),
            text = text
        )
    }

    fun toVoiceIngestRequest(update: Update): TelegramIngestRequest? {
        val message = update.message ?: return null
        val from = message.from ?: return null
        val chat = message.chat ?: return null
        val voice = message.voice ?: return null

        return TelegramIngestRequest(
            telegramUserId = from.id.toString(),
            telegramChatId = chat.id.toString(),
            telegramMessageId = message.messageId.toString(),
            voice = TelegramVoicePayload(
                fileId = voice.fileId,
                fileUniqueId = voice.fileUniqueId,
                durationSeconds = voice.duration,
                mimeType = voice.mimeType
            )
        )
    }
}
