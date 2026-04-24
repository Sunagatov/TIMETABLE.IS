package com.sunagatov.memora.telegrambot.ingest

data class TelegramVoicePayload(
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
    val voice: TelegramVoicePayload? = null
)

data class TelegramAcceptedResponse(
    val memoraId: String
)

data class TelegramFailureNotification(
    val notificationId: String,
    val telegramChatId: String,
    val memoraId: String,
    val failedStage: String,
    val summary: String,
    val retryContext: String? = null
)
