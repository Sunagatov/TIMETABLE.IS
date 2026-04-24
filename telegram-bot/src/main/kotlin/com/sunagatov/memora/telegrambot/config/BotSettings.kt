package com.sunagatov.memora.telegrambot.config

data class BotSettings(
    val token: String,
    val backendBaseUrl: String,
    val backendBotIngestToken: String,
    val ownerTelegramUserId: Long,
    val textCapturePath: String,
    val voiceCapturePath: String,
    val failureNotificationsPath: String,
    val failureNotificationAckPathTemplate: String,
    val failurePollIntervalSeconds: Long
) {
    companion object {
        fun fromEnvironment(): BotSettings =
            BotSettings(
                token = env("TELEGRAM_BOT_TOKEN"),
                backendBaseUrl = env("BACKEND_BASE_URL"),
                backendBotIngestToken = env("BACKEND_BOT_INGEST_TOKEN"),
                ownerTelegramUserId = env("OWNER_TELEGRAM_USER_ID").toLong(),
                textCapturePath = envOrDefault(
                    "BACKEND_TEXT_CAPTURE_PATH",
                    "/api/v1/telegram/items/text"
                ),
                voiceCapturePath = envOrDefault(
                    "BACKEND_VOICE_CAPTURE_PATH",
                    "/api/v1/telegram/items/voice"
                ),
                failureNotificationsPath = envOrDefault(
                    "BACKEND_FAILURE_NOTIFICATIONS_PATH",
                    "/api/v1/telegram/failure-notifications"
                ),
                failureNotificationAckPathTemplate = envOrDefault(
                    "BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE",
                    "/api/v1/telegram/failure-notifications/%s/delivered"
                ),
                failurePollIntervalSeconds = envOrDefault(
                    "FAILURE_POLL_INTERVAL_SECONDS",
                    "5"
                ).toLong()
            )

        private fun env(name: String): String =
            System.getenv(name)?.takeIf { it.isNotBlank() }
                ?: throw IllegalStateException("Missing environment variable: $name")

        private fun envOrDefault(name: String, defaultValue: String): String =
            System.getenv(name)?.takeIf { it.isNotBlank() } ?: defaultValue
    }
}
