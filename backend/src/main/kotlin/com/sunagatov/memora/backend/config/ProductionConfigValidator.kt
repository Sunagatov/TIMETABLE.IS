package com.sunagatov.memora.backend.config

import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component

@Component
class ProductionConfigValidator(
    private val properties: MemoraProperties,
    private val environment: Environment
) : ApplicationRunner {

    override fun run(args: ApplicationArguments) {
        if (!shouldValidate()) {
            return
        }

        val errors = buildList {
            if (properties.botIngestToken.isBlank() || properties.botIngestToken == "change-me") {
                add("BACKEND_BOT_INGEST_TOKEN must be set to a non-placeholder value")
            }
            if (properties.appPasswordHash.isBlank() || properties.appPasswordHash == DEFAULT_APP_PASSWORD_HASH) {
                add("BACKEND_APP_PASSWORD_HASH must be set to a non-placeholder bcrypt hash")
            }
            if (!properties.appPassword.isNullOrBlank()) {
                add("BACKEND_APP_PASSWORD plaintext override is local/dev-only and must not be set")
            }
            if (properties.ownerTelegramUserId.isBlank()) {
                add("MEMORA_OWNER_TELEGRAM_USER_ID must be set")
            }
            if (properties.telegramBotToken.isBlank()) {
                add("MEMORA_TELEGRAM_BOT_TOKEN must be set when production validation is enabled")
            }
            if (properties.telegramApiBaseUrl.isBlank()) {
                add("MEMORA_TELEGRAM_API_BASE_URL must be set when production validation is enabled")
            }
            if (properties.transcriptionApiKey.isBlank()) {
                add("MEMORA_TRANSCRIPTION_API_KEY must be set when production validation is enabled")
            }
            if (properties.transcriptionApiBaseUrl.isBlank()) {
                add("MEMORA_TRANSCRIPTION_API_BASE_URL must be set when production validation is enabled")
            }
            if (properties.transcriptionModel.isBlank()) {
                add("MEMORA_TRANSCRIPTION_MODEL must be set when production validation is enabled")
            }
            if (properties.transcriptionTimeoutSeconds <= 0) {
                add("MEMORA_TRANSCRIPTION_TIMEOUT_SECONDS must be greater than 0")
            }
            if (properties.transcriptionMaxAudioBytes <= 0) {
                add("MEMORA_TRANSCRIPTION_MAX_AUDIO_BYTES must be greater than 0")
            }
            if (properties.transcriptionMaxDurationSeconds <= 0) {
                add("MEMORA_TRANSCRIPTION_MAX_DURATION_SECONDS must be greater than 0")
            }
            if (properties.aiMode != OPENAI_MODE) {
                add("MEMORA_AI_MODE must be set to openai when production validation is enabled")
            }
            if (properties.aiApiKey.isBlank()) {
                add("MEMORA_AI_API_KEY must be set when production validation is enabled")
            }
            if (properties.aiApiBaseUrl.isBlank()) {
                add("MEMORA_AI_API_BASE_URL must be set when production validation is enabled")
            }
            if (properties.aiModel.isBlank()) {
                add("MEMORA_AI_MODEL must be set when production validation is enabled")
            }
            if (properties.aiFallbackToDeterministic) {
                add("MEMORA_AI_FALLBACK_TO_DETERMINISTIC must be false when production validation is enabled")
            }
        }

        check(errors.isEmpty()) {
            "Unsafe production configuration: ${errors.joinToString("; ")}"
        }
    }

    private fun shouldValidate(): Boolean =
        properties.validateProductionConfig ||
            environment.activeProfiles.any { it == "prod" || it == "production" }

    private companion object {
        const val DEFAULT_APP_PASSWORD_HASH =
            "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza"
        const val OPENAI_MODE = "openai"
    }
}
