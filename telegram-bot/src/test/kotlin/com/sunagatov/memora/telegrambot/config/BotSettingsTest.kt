package com.sunagatov.memora.telegrambot.config

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class BotSettingsTest {

    @Test
    fun `parses valid env and defaults`() {
        val settings = BotSettings.fromMap(validEnv())

        assertEquals("123456:test-token", settings.token)
        assertEquals("http://localhost:8080", settings.backendBaseUrl)
        assertEquals("secret", settings.backendBotIngestToken)
        assertEquals(123456789L, settings.ownerTelegramUserId)
        assertEquals("/api/capture/telegram/ingest", settings.ingestPath)
        assertEquals("/api/capture/telegram/failure-notifications", settings.failureNotificationsPath)
        assertEquals(
            "/api/capture/telegram/failure-notifications/%s/delivered",
            settings.failureNotificationAckPathTemplate
        )
        assertEquals(5L, settings.failurePollIntervalSeconds)
        assertEquals(10L, settings.backendTimeoutSeconds)
    }

    @Test
    fun `loads custom backend paths`() {
        val settings = BotSettings.fromMap(
            validEnv() + mapOf(
                "BACKEND_TELEGRAM_INGEST_PATH" to "/custom/ingest",
                "BACKEND_FAILURE_NOTIFICATIONS_PATH" to "/custom/failures",
                "BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE" to "/custom/failures/%s/delivered"
            )
        )

        assertEquals("/custom/ingest", settings.ingestPath)
        assertEquals("/custom/failures", settings.failureNotificationsPath)
        assertEquals("/custom/failures/%s/delivered", settings.failureNotificationAckPathTemplate)
    }

    @Test
    fun `trims trailing backend base url slash`() {
        val settings = BotSettings.fromMap(validEnv() + ("BACKEND_BASE_URL" to "https://api.example.test/"))

        assertEquals("https://api.example.test", settings.backendBaseUrl)
    }

    @Test
    fun `rejects placeholder telegram bot tokens`() {
        listOf(
            "replace-me",
            "change-me",
            "telegram-bot-token",
            "your-telegram-bot-token",
            "bot-token"
        ).forEach { placeholder ->
            assertFailsWith<IllegalStateException> {
                BotSettings.fromMap(validEnv() + ("TELEGRAM_BOT_TOKEN" to placeholder))
            }
        }
    }

    @Test
    fun `rejects invalid backend base url`() {
        listOf("not-a-url", "ftp://localhost:8080", "http:///missing-host").forEach { value ->
            assertFailsWith<IllegalStateException> {
                BotSettings.fromMap(validEnv() + ("BACKEND_BASE_URL" to value))
            }
        }
    }

    @Test
    fun `rejects invalid owner telegram user id`() {
        assertFailsWith<IllegalStateException> {
            BotSettings.fromMap(validEnv() + ("OWNER_TELEGRAM_USER_ID" to "not-a-number"))
        }

        assertFailsWith<IllegalStateException> {
            BotSettings.fromMap(validEnv() + ("OWNER_TELEGRAM_USER_ID" to "0"))
        }
    }

    @Test
    fun `rejects invalid polling interval and timeout`() {
        assertFailsWith<IllegalStateException> {
            BotSettings.fromMap(validEnv() + ("FAILURE_POLL_INTERVAL_SECONDS" to "0"))
        }

        assertFailsWith<IllegalStateException> {
            BotSettings.fromMap(validEnv() + ("BACKEND_TIMEOUT_SECONDS" to "0"))
        }
    }

    private fun validEnv(): Map<String, String> =
        mapOf(
            "TELEGRAM_BOT_TOKEN" to "123456:test-token",
            "BACKEND_BOT_INGEST_TOKEN" to "secret",
            "OWNER_TELEGRAM_USER_ID" to "123456789"
        )
}
