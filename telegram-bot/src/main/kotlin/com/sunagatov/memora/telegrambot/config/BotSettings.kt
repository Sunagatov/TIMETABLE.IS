package com.sunagatov.memora.telegrambot.config

data class BotSettings(
    val token: String,
    val backendBaseUrl: String,
    val backendBotIngestToken: String,
    val ownerTelegramUserId: Long,
    val ingestPath: String,
    val failureNotificationsPath: String,
    val failureNotificationAckPathTemplate: String,
    val failurePollIntervalSeconds: Long
) {
    companion object {
        fun fromEnvironment(): BotSettings =
            BotSettings(
                token = env("TELEGRAM_BOT_TOKEN"),
                backendBaseUrl = envOrDefault("BACKEND_BASE_URL", "http://localhost:8080"),
                backendBotIngestToken = env("BACKEND_BOT_INGEST_TOKEN"),
                ownerTelegramUserId = env("OWNER_TELEGRAM_USER_ID").toLong(),
                ingestPath = envOrDefault(
                    "BACKEND_TELEGRAM_INGEST_PATH",
                    "/api/capture/telegram/ingest"
                ),
                failureNotificationsPath = envOrDefault(
                    "BACKEND_FAILURE_NOTIFICATIONS_PATH",
                    "/api/capture/telegram/failure-notifications"
                ),
                failureNotificationAckPathTemplate = envOrDefault(
                    "BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE",
                    "/api/capture/telegram/failure-notifications/%s/delivered"
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
