package com.sunagatov.memora.telegrambot

data class BotSettings(
    val token: String,
    val ownerTelegramUserId: Long,
    val backendBaseUrl: String,
    val backendBotIngestToken: String
) {
    companion object {
        fun fromEnvironment(): BotSettings =
            BotSettings(
                token = requireEnv("TELEGRAM_BOT_TOKEN"),
                ownerTelegramUserId = requireEnv("OWNER_TELEGRAM_USER_ID").toLong(),
                backendBaseUrl = requireEnv("BACKEND_BASE_URL"),
                backendBotIngestToken = requireEnv("BACKEND_BOT_INGEST_TOKEN")
            )

        private fun requireEnv(name: String): String =
            System.getenv(name)?.takeIf { it.isNotBlank() }
                ?: error("Missing required environment variable: $name")
    }
}
