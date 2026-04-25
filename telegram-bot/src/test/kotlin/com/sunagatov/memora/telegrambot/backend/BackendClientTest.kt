package com.sunagatov.memora.telegrambot.backend

import com.sun.net.httpserver.HttpExchange
import com.sun.net.httpserver.HttpServer
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramIngestRequest
import java.net.InetSocketAddress
import kotlin.test.AfterTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class BackendClientTest {

    private var server: HttpServer? = null

    @AfterTest
    fun stopServer() {
        server?.stop(0)
    }

    @Test
    fun `builds ingest request with bot token and configured path`() {
        var seenPath = ""
        var seenToken = ""
        var seenBody = ""
        startServer { exchange ->
            seenPath = exchange.requestURI.path
            seenToken = exchange.requestHeaders.getFirst("X-Memora-Bot-Token")
            seenBody = exchange.requestBody.readBytes().toString(Charsets.UTF_8)
            exchange.respond("""{"memoraId":"item-123"}""")
        }

        val accepted = client(ingestPath = "/custom/ingest").ingestText(
            TelegramIngestRequest(
                telegramUserId = "1",
                telegramChatId = "2",
                telegramMessageId = "3",
                text = "hello"
            )
        )

        assertEquals("item-123", accepted.memoraId)
        assertEquals("/custom/ingest", seenPath)
        assertEquals("secret-token", seenToken)
        assertEquals(true, seenBody.contains("\"text\":\"hello\""))
    }

    @Test
    fun `parses failure notifications from raw array`() {
        startServer { exchange ->
            exchange.respond(
                """
                [
                  {
                    "notificationId": "item-1:123",
                    "telegramChatId": "chat-1",
                    "memoraId": "item-1",
                    "failedStage": "transcription",
                    "summary": "failed"
                  }
                ]
                """.trimIndent()
            )
        }

        val notifications = client().fetchFailureNotifications()

        assertEquals(1, notifications.size)
        assertEquals("item-1:123", notifications.single().notificationId)
    }

    @Test
    fun `parses failure notifications from object wrapper`() {
        startServer { exchange ->
            exchange.respond(
                """
                {
                  "notifications": [
                    {
                      "notificationId": "item-2:456",
                      "telegramChatId": "chat-2",
                      "memoraId": "item-2",
                      "failedStage": "ai-processing",
                      "summary": "failed",
                      "retryContext": "aiRetries=2/2"
                    }
                  ]
                }
                """.trimIndent()
            )
        }

        val notifications = client().fetchFailureNotifications()

        assertEquals(1, notifications.size)
        assertEquals("item-2:456", notifications.single().notificationId)
        assertEquals("aiRetries=2/2", notifications.single().retryContext)
    }

    @Test
    fun `blank failure notifications response returns empty list`() {
        startServer { exchange ->
            exchange.respond("")
        }

        val notifications = client().fetchFailureNotifications()

        assertEquals(emptyList(), notifications)
    }

    @Test
    fun `url encodes failure notification acknowledgement id`() {
        var seenPath = ""
        startServer { exchange ->
            seenPath = exchange.requestURI.rawPath
            exchange.respond("")
        }

        client().acknowledgeFailureNotification("item 1:456")

        assertEquals("/api/capture/telegram/failure-notifications/item%201%3A456/delivered", seenPath)
    }

    @Test
    fun `non success backend response throws useful exception`() {
        startServer { exchange ->
            exchange.respond("""{"error":"bad token"}""", status = 401)
        }

        val exception = assertFailsWith<IllegalStateException> {
            client().fetchFailureNotifications()
        }

        assertTrue(exception.message?.contains("Backend call failed for") == true)
        assertTrue(exception.message?.contains("401") == true)
        assertTrue(exception.message?.contains("bad token") == true)
    }

    private fun startServer(handler: (HttpExchange) -> Unit) {
        server = HttpServer.create(InetSocketAddress(0), 0).apply {
            createContext("/") { exchange -> handler(exchange) }
            start()
        }
    }

    private fun client(ingestPath: String = "/api/capture/telegram/ingest"): BackendClient =
        BackendClient(
            BotSettings.fromMap(
                mapOf(
                    "TELEGRAM_BOT_TOKEN" to "123456:test-token",
                    "BACKEND_BASE_URL" to "http://localhost:${serverAddress().port}",
                    "BACKEND_BOT_INGEST_TOKEN" to "secret-token",
                    "OWNER_TELEGRAM_USER_ID" to "123",
                    "BACKEND_TELEGRAM_INGEST_PATH" to ingestPath
                )
            )
        )

    private fun serverAddress(): InetSocketAddress =
        server?.address ?: error("server is not started")

    private fun HttpExchange.respond(body: String, status: Int = 200) {
        val bytes = body.toByteArray()
        responseHeaders.add("Content-Type", "application/json")
        sendResponseHeaders(status, bytes.size.toLong())
        responseBody.use { it.write(bytes) }
    }
}
