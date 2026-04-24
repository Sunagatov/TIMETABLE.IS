package com.sunagatov.memora.telegrambot.ingest

data class TelegramTextIngestRequest(
    val telegramUserId: Long,
    val telegramChatId: Long,
    val telegramMessageId: Int,
    val text: String
)

data class TelegramVoiceIngestRequest(
    val telegramUserId: Long,
    val telegramChatId: Long,
    val telegramMessageId: Int,
    val telegramFileId: String,
    val telegramFileUniqueId: String,
    val durationSeconds: Int? = null,
    val mimeType: String? = null,
    val fileSizeBytes: Long? = null
)

data class TelegramAcceptedResponse(
    val memoraId: String
)

data class TelegramFailureNotification(
    val notificationId: String,
    val telegramChatId: Long,
    val memoraId: String,
    val failedStage: String,
    val summary: String,
    val retryContext: String? = null
)
