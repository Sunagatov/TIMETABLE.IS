package com.sunagatov.memora.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "memora")
data class MemoraProperties(
    val storage: Storage = Storage(),
    val http: Http = Http(),
    val auth: Auth = Auth(),
    val capture: Capture = Capture(),
    val category: Category = Category(),
    val processing: Processing = Processing(),
    val telegram: Telegram = Telegram(),
    val transcription: Transcription = Transcription(),
    val ai: Ai = Ai(),
    val validation: Validation = Validation()
) {
    data class Storage(
        val mode: String = "mongo"
    )

    data class Http(
        val allowedOrigin: String = "http://localhost:5173"
    )

    data class Auth(
        val appPassword: String? = null,
        val appPasswordHash: String = "",
        val sessionDays: Long = 30,
        val cookieSecure: Boolean = true
    )

    data class Capture(
        val botIngestToken: String = "change-me",
        val ownerTelegramUserId: String = ""
    )

    data class Category(
        val defaultPath: String = "Default/General"
    )

    data class Processing(
        val transcriptionAutoRetryAttempts: Int = 3,
        val aiAutoRetryAttempts: Int = 2
    )

    data class Telegram(
        val botToken: String = "",
        val apiBaseUrl: String = "https://api.telegram.org"
    )

    data class Transcription(
        val apiKey: String = "",
        val apiBaseUrl: String = "https://api.openai.com",
        val model: String = "gpt-4o-mini-transcribe",
        val language: String = "",
        val prompt: String = "",
        val timeoutSeconds: Long = 120,
        val maxAudioBytes: Long = 25L * 1024L * 1024L,
        val maxDurationSeconds: Int = 600
    )

    data class Ai(
        val mode: String = "deterministic",
        val apiKey: String = "",
        val apiBaseUrl: String = "https://api.openai.com",
        val model: String = "gpt-4o-mini",
        val timeoutSeconds: Long = 60,
        val fallbackToDeterministic: Boolean = true
    )

    data class Validation(
        val productionConfig: Boolean = false
    )

    val allowedOrigin: String
        get() = http.allowedOrigin

    val appPassword: String?
        get() = auth.appPassword

    val appPasswordHash: String
        get() = auth.appPasswordHash

    val sessionDays: Long
        get() = auth.sessionDays

    val cookieSecure: Boolean
        get() = auth.cookieSecure

    val botIngestToken: String
        get() = capture.botIngestToken

    val ownerTelegramUserId: String
        get() = capture.ownerTelegramUserId

    val defaultCategoryPath: String
        get() = category.defaultPath

    val transcriptionAutoRetryAttempts: Int
        get() = processing.transcriptionAutoRetryAttempts

    val aiAutoRetryAttempts: Int
        get() = processing.aiAutoRetryAttempts

    val telegramBotToken: String
        get() = telegram.botToken

    val telegramApiBaseUrl: String
        get() = telegram.apiBaseUrl

    val transcriptionApiKey: String
        get() = transcription.apiKey

    val transcriptionApiBaseUrl: String
        get() = transcription.apiBaseUrl

    val transcriptionModel: String
        get() = transcription.model

    val transcriptionLanguage: String
        get() = transcription.language

    val transcriptionPrompt: String
        get() = transcription.prompt

    val transcriptionTimeoutSeconds: Long
        get() = transcription.timeoutSeconds

    val transcriptionMaxAudioBytes: Long
        get() = transcription.maxAudioBytes

    val transcriptionMaxDurationSeconds: Int
        get() = transcription.maxDurationSeconds

    val aiMode: String
        get() = ai.mode

    val aiApiKey: String
        get() = ai.apiKey

    val aiApiBaseUrl: String
        get() = ai.apiBaseUrl

    val aiModel: String
        get() = ai.model

    val aiTimeoutSeconds: Long
        get() = ai.timeoutSeconds

    val aiFallbackToDeterministic: Boolean
        get() = ai.fallbackToDeterministic

    val validateProductionConfig: Boolean
        get() = validation.productionConfig
}
