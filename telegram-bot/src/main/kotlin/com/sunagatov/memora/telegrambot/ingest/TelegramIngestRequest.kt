package com.sunagatov.memora.telegrambot.ingest

data class TelegramVoiceMetadata(
    val fileId: String,
    val fileUniqueId: String,
    val durationSeconds: Int? = null,
    val mimeType: String? = null
)

data class TelegramIngestRequest(
    val telegramUserId: String,
    val telegramChatId: String,
    val telegramMessageId: String,
    val text: String? = null,
    val voice: TelegramVoiceMetadata? = null
)
