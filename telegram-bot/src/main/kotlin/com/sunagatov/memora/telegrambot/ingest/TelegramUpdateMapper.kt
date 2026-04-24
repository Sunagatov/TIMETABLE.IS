package com.sunagatov.memora.telegrambot.ingest

import org.telegram.telegrambots.meta.api.objects.Update

class TelegramUpdateMapper {

    fun toTextIngestRequest(update: Update): TelegramTextIngestRequest? {
        val message = update.message ?: return null
        val from = message.from ?: return null
        val chat = message.chat ?: return null
        val text = message.text ?: return null
        if (text.isBlank()) {
            return null
        }

        return TelegramTextIngestRequest(
            telegramUserId = from.id,
            telegramChatId = chat.id,
            telegramMessageId = message.messageId,
            text = text
        )
    }

    fun toVoiceIngestRequest(update: Update): TelegramVoiceIngestRequest? {
        val message = update.message ?: return null
        val from = message.from ?: return null
        val chat = message.chat ?: return null
        val voice = message.voice ?: return null

        return TelegramVoiceIngestRequest(
            telegramUserId = from.id,
            telegramChatId = chat.id,
            telegramMessageId = message.messageId,
            telegramFileId = voice.fileId,
            telegramFileUniqueId = voice.fileUniqueId,
            durationSeconds = voice.duration,
            mimeType = voice.mimeType,
            fileSizeBytes = voice.fileSize
        )
    }
}
