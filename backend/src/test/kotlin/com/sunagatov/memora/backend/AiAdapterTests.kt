package com.sunagatov.memora.backend

import com.sun.net.httpserver.HttpExchange
import com.sun.net.httpserver.HttpServer
import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.ai.AiTextInput
import com.sunagatov.memora.backend.item.ai.OpenAiCompatibleMemoraAiPort
import com.sunagatov.memora.backend.item.model.ItemType
import java.net.InetSocketAddress
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class AiAdapterTests {

    @Test
    fun `openai compatible adapter falls back to deterministic draft on provider failure when enabled`() {
        val defaultPath = CategoryPath("Default", "General")

        withServer { server ->
            server.createContext("/v1/chat/completions") { exchange ->
                exchange.respond(500, "provider unavailable")
            }

            val adapter = OpenAiCompatibleMemoraAiPort(
                testProperties(aiApiBaseUrl = server.baseUrl())
            )

            val draft = adapter.generateAllDraft(
                AiTextInput(
                    rawText = "What is Kotlin?",
                    existingCategoryPaths = listOf(defaultPath),
                    defaultCategoryPath = defaultPath
                )
            )

            assertEquals("What is Kotlin?", draft.textDraft.cleanedText)
            assertEquals(ItemType.QUESTION, draft.textDraft.type)
            assertEquals("Model-knowledge placeholder answer: What is Kotlin?", draft.answerDraft.answer)
        }
    }

    @Test
    fun `openai compatible adapter prefers backend existing category over false ai boolean`() {
        val defaultPath = CategoryPath("Default", "General")
        val existingPath = CategoryPath("Work", "Backend")

        withServer { server ->
            server.createContext("/v1/chat/completions") { exchange ->
                exchange.respond(
                    200,
                    """
                    {
                      "choices": [
                        {
                          "message": {
                            "content": "{\"title\":\"Backend note\",\"cleanedText\":\"Backend note\",\"type\":\"IDEA\",\"priority\":\"NOT_APPLICABLE\",\"categoryPath\":{\"category\":\"Work\",\"subcategory\":\"Backend\"},\"categoryPathIsExisting\":false,\"answer\":null}"
                          }
                        }
                      ]
                    }
                    """.trimIndent()
                )
            }

            val draft = adapter(server).generateAllDraft(
                AiTextInput(
                    rawText = "Backend note",
                    existingCategoryPaths = listOf(defaultPath, existingPath),
                    defaultCategoryPath = defaultPath
                )
            )

            assertEquals(existingPath, draft.categoryDraft.aiCategoryPath)
            assertNull(draft.categoryDraft.proposedCategoryPath)
            assertEquals(existingPath, draft.categoryDraft.currentCategoryPath)
        }
    }

    private fun adapter(server: HttpServer): OpenAiCompatibleMemoraAiPort =
        OpenAiCompatibleMemoraAiPort(testProperties(aiApiBaseUrl = server.baseUrl()))

    private fun withServer(block: (HttpServer) -> Unit) {
        val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
        try {
            server.start()
            block(server)
        } finally {
            server.stop(0)
        }
    }

    private fun HttpServer.baseUrl(): String =
        "http://${address.hostString}:${address.port}"

    private fun HttpExchange.respond(status: Int, body: String) {
        val bytes = body.toByteArray()
        sendResponseHeaders(status, bytes.size.toLong())
        responseBody.use { it.write(bytes) }
    }

    private fun testProperties(
        aiApiBaseUrl: String
    ): MemoraProperties =
        MemoraProperties(
            allowedOrigin = "http://localhost:5173",
            appPassword = null,
            appPasswordHash = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
            sessionDays = 30,
            botIngestToken = "bot-token",
            defaultCategoryPath = "Default/General",
            ownerTelegramUserId = "owner-1",
            transcriptionAutoRetryAttempts = 3,
            aiAutoRetryAttempts = 2,
            aiApiKey = "ai-key",
            aiApiBaseUrl = aiApiBaseUrl,
            aiFallbackToDeterministic = true
        )
}
