package com.sunagatov.memora.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "memora")
data class MemoraProperties(
    val allowedOrigin: String,
    val appPassword: String?,
    val appPasswordHash: String,
    val sessionDays: Long,
    val botIngestToken: String,
    val defaultCategoryPath: String,
    val ownerTelegramUserId: String,
    val transcriptionAutoRetryAttempts: Int,
    val aiAutoRetryAttempts: Int,
    val telegramBotToken: String = "",
    val telegramApiBaseUrl: String = "https://api.telegram.org",
    val transcriptionApiKey: String = "",
    val transcriptionApiBaseUrl: String = "https://api.openai.com",
    val transcriptionModel: String = "gpt-4o-mini-transcribe",
    val transcriptionLanguage: String = "",
    val transcriptionTimeoutSeconds: Long = 120
)
