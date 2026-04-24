package com.sunagatov.memora.backend.capture.api

data class TelegramFailureNotificationResponse(
    val notificationId: String,
    val telegramChatId: String,
    val memoraId: String,
    val failedStage: String,
    val summary: String,
    val retryContext: String? = null
)
