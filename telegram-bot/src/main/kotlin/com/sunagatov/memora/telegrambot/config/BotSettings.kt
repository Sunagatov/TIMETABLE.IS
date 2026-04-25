package com.sunagatov.memora.telegrambot.config

import java.net.URI

data class BotSettings(
    val token: String,
    val backendBaseUrl: String,
    val backendBotIngestToken: String,
    val ownerTelegramUserId: Long,
    val ingestPath: String,
    val failureNotificationsPath: String,
    val failureNotificationAckPathTemplate: String,
    val failurePollIntervalSeconds: Long,
    val backendTimeoutSeconds: Long
) {
    companion object {
        fun fromEnvironment(): BotSettings =
            fromMap(System.getenv())

        fun fromMap(env: Map<String, String>): BotSettings =
            BotSettings(
                token = required(env, "TELEGRAM_BOT_TOKEN")
                    .rejectPlaceholder("TELEGRAM_BOT_TOKEN"),
                backendBaseUrl = backendBaseUrl(env),
                backendBotIngestToken = required(env, "BACKEND_BOT_INGEST_TOKEN"),
                ownerTelegramUserId = ownerTelegramUserId(env),
                ingestPath = envOrDefault(
                    env,
                    "BACKEND_TELEGRAM_INGEST_PATH",
                    "/api/capture/telegram/ingest"
                ),
                failureNotificationsPath = envOrDefault(
                    env,
                    "BACKEND_FAILURE_NOTIFICATIONS_PATH",
                    "/api/capture/telegram/failure-notifications"
                ),
                failureNotificationAckPathTemplate = envOrDefault(
                    env,
                    "BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE",
                    "/api/capture/telegram/failure-notifications/%s/delivered"
                ),
                failurePollIntervalSeconds = atLeastOne(
                    env,
                    "FAILURE_POLL_INTERVAL_SECONDS",
                    defaultValue = "5"
                ),
                backendTimeoutSeconds = atLeastOne(
                    env,
                    "BACKEND_TIMEOUT_SECONDS",
                    defaultValue = "10"
                )
            )

        private fun backendBaseUrl(env: Map<String, String>): String {
            val value = envOrDefault(env, "BACKEND_BASE_URL", "http://localhost:8080")
                .trim()
                .ifBlank { "http://localhost:8080" }
                .removeSuffix("/")

            val uri = runCatching { URI(value) }.getOrElse {
                throw IllegalStateException("BACKEND_BASE_URL must be a valid http/https URI.")
            }
            if (uri.scheme !in setOf("http", "https") || uri.host.isNullOrBlank()) {
                throw IllegalStateException(
                    "BACKEND_BASE_URL must be a valid http/https URI, for example http://localhost:8080."
                )
            }
            return value
        }

        private fun required(env: Map<String, String>, name: String): String =
            env[name]?.trim()?.takeIf { it.isNotBlank() }
                ?: throw IllegalStateException("Missing required environment variable: $name.")

        private fun ownerTelegramUserId(env: Map<String, String>): Long {
            val name = "OWNER_TELEGRAM_USER_ID"
            val raw = required(env, name)
            val parsed = raw.toLongOrNull()
                ?: throw IllegalStateException("$name must be a positive integer Telegram user id.")
            if (parsed <= 0) {
                throw IllegalStateException("$name must be a positive integer Telegram user id.")
            }
            return parsed
        }

        private fun atLeastOne(env: Map<String, String>, name: String, defaultValue: String): Long {
            val raw = envOrDefault(env, name, defaultValue)
            val parsed = raw.toLongOrNull()
                ?: throw IllegalStateException("$name must be an integer number of seconds.")
            if (parsed < 1) {
                throw IllegalStateException("$name must be at least 1 second.")
            }
            return parsed
        }

        private fun String.rejectPlaceholder(name: String): String {
            val normalized = lowercase()
            val placeholders = setOf(
                "replace-me",
                "change-me",
                "telegram-bot-token",
                "your-telegram-bot-token",
                "bot-token"
            )
            if (normalized in placeholders || normalized.contains("replace_me")) {
                throw IllegalStateException("$name must be set to a real Telegram bot token, not a placeholder.")
            }
            return this
        }

        private fun envOrDefault(env: Map<String, String>, name: String, defaultValue: String): String =
            env[name]?.takeIf { it.isNotBlank() } ?: defaultValue
    }
}
