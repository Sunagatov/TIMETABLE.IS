package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.auth.security.SessionAuthFilter
import com.sunagatov.memora.backend.auth.session.InMemorySessionStore
import com.sunagatov.memora.backend.auth.session.SessionCookieFactory
import com.sunagatov.memora.backend.auth.session.SessionService
import com.sunagatov.memora.backend.capture.api.TELEGRAM_BOT_TOKEN_HEADER
import com.sunagatov.memora.backend.capture.api.TELEGRAM_CAPTURE_INGEST_PATH
import com.sunagatov.memora.backend.capture.security.BotIngestTokenFilter
import com.sunagatov.memora.backend.config.MemoraProperties
import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

class AuthSecurityTests {

    @Test
    fun `login with valid password creates session and invalid password is rejected`() {
        val store = InMemorySessionStore()
        val service = SessionService(store, testProperties(appPassword = "local-password"), BCryptPasswordEncoder())

        val sessionId = service.login("local-password")

        assertTrue(service.isValid(sessionId))
        assertFailsWith<IllegalArgumentException> {
            service.login("wrong-password")
        }
    }

    @Test
    fun `expired session is invalidated`() {
        val store = InMemorySessionStore()
        val service = SessionService(store, testProperties(), BCryptPasswordEncoder())

        store.create("expired-session", Instant.now().minusSeconds(10).epochSecond)

        assertTrue(!service.isValid("expired-session"))
        assertTrue(!store.exists("expired-session"))
    }

    @Test
    fun `session filter protects api items and allows health and auth endpoints`() {
        val service = SessionService(InMemorySessionStore(), testProperties(), BCryptPasswordEncoder())
        val filter = SessionAuthFilter(service, SessionCookieFactory(testProperties()))

        val protectedRequest = MockHttpServletRequest("GET", "/api/items/approved")
        val protectedResponse = MockHttpServletResponse()
        var reachedProtectedController = false

        filter.doFilter(
            protectedRequest,
            protectedResponse,
            { _, _ -> reachedProtectedController = true }
        )

        assertEquals(401, protectedResponse.status)
        assertTrue(!reachedProtectedController)

        listOf("/api/health", "/api/auth/session").forEach { path ->
            val request = MockHttpServletRequest("GET", path)
            val response = MockHttpServletResponse()
            var reachedController = false

            filter.doFilter(request, response) { _, _ -> reachedController = true }

            assertTrue(reachedController)
        }
    }

    @Test
    fun `bot capture endpoint rejects invalid token`() {
        val filter = BotIngestTokenFilter(testProperties(botIngestToken = "expected-token"))
        val request = MockHttpServletRequest("POST", TELEGRAM_CAPTURE_INGEST_PATH)
        val response = MockHttpServletResponse()
        var reachedController = false

        request.addHeader(TELEGRAM_BOT_TOKEN_HEADER, "wrong-token")
        filter.doFilter(request, response) { _, _ -> reachedController = true }

        assertEquals(401, response.status)
        assertTrue(!reachedController)
    }

    private fun testProperties(
        appPassword: String? = null,
        botIngestToken: String = "bot-token"
    ): MemoraProperties =
        MemoraProperties(
            allowedOrigin = "http://localhost:5173",
            appPassword = appPassword,
            appPasswordHash = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
            sessionDays = 30,
            botIngestToken = botIngestToken,
            defaultCategoryPath = "Default/General",
            ownerTelegramUserId = "owner-1",
            transcriptionAutoRetryAttempts = 3,
            aiAutoRetryAttempts = 2
        )
}
