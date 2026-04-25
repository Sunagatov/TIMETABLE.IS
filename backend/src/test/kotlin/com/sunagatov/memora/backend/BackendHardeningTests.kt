package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.capture.security.BotIngestTokenFilter
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.config.ProductionConfigValidator
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue
import org.springframework.boot.DefaultApplicationArguments
import org.springframework.mock.env.MockEnvironment
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse

class BackendHardeningTests {

    @Test
    fun `bot ingest filter does not accept blank configured token`() {
        val filter = BotIngestTokenFilter(testProperties(botIngestToken = ""))
        val request = MockHttpServletRequest("POST", "/api/capture/telegram/ingest")
        val response = MockHttpServletResponse()
        var reachedController = false

        request.addHeader("X-Memora-Bot-Token", "")
        filter.doFilter(request, response) { _, _ -> reachedController = true }

        assertEquals(500, response.status)
        assertContains(response.contentAsString, "Bot ingest token is not configured")
        assertTrue(!reachedController)
    }

    @Test
    fun `production config rejects plaintext password override`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(appPassword = "local-only-password", appPasswordHash = "non-default-hash"),
            environment = MockEnvironment().apply { setActiveProfiles("prod") }
        )

        val exception = assertFailsWith<IllegalStateException> {
            validator.run(DefaultApplicationArguments())
        }

        assertContains(exception.message!!, "BACKEND_APP_PASSWORD plaintext override")
    }

    private fun testProperties(
        appPassword: String? = null,
        appPasswordHash: String = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
        botIngestToken: String = "bot-token"
    ): MemoraProperties =
        MemoraProperties(
            allowedOrigin = "http://localhost:5173",
            appPassword = appPassword,
            appPasswordHash = appPasswordHash,
            sessionDays = 30,
            botIngestToken = botIngestToken,
            defaultCategoryPath = "Default/General",
            ownerTelegramUserId = "owner-1",
            transcriptionAutoRetryAttempts = 3,
            aiAutoRetryAttempts = 2
        )
}
