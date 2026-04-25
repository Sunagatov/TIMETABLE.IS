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
        assertEquals(5L, settings.failurePollIntervalSeconds)
        assertEquals(10L, settings.backendTimeoutSeconds)
    }

    @Test
    fun `trims trailing backend base url slash`() {
        val settings = BotSettings.fromMap(validEnv() + ("BACKEND_BASE_URL" to "https://api.example.test/"))

        assertEquals("https://api.example.test", settings.backendBaseUrl)
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
