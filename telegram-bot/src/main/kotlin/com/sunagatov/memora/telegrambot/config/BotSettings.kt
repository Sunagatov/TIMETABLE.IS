package com.sunagatov.memora.telegrambot.config

data class BotSettings(
    val token: String,
    val backendBaseUrl: String,
    val backendBotIngestToken: String,
    val ownerTelegramUserId: String
) {
    companion object {
        fun fromEnvironment(): BotSettings =
            BotSettings(
                token = env("TELEGRAM_BOT_TOKEN"),
                backendBaseUrl = env("BACKEND_BASE_URL"),
                backendBotIngestToken = env("BACKEND_BOT_INGEST_TOKEN"),
                ownerTelegramUserId = env("OWNER_TELEGRAM_USER_ID")
            )

        private fun env(name: String): String =
            System.getenv(name)?.takeIf { it.isNotBlank() }
                ?: throw IllegalStateException("Missing environment variable: $name")
    }
}
