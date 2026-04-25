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
    val transcriptionTimeoutSeconds: Long = 120,
    val transcriptionMaxAudioBytes: Long = 25L * 1024L * 1024L,
    val transcriptionMaxDurationSeconds: Int = 600,
    val cookieSecure: Boolean = true,
    val aiMode: String = "deterministic",
    val aiApiKey: String = "",
    val aiApiBaseUrl: String = "https://api.openai.com",
    val aiModel: String = "gpt-4o-mini",
    val aiTimeoutSeconds: Long = 60,
    val aiFallbackToDeterministic: Boolean = true,
    val validateProductionConfig: Boolean = false
)
