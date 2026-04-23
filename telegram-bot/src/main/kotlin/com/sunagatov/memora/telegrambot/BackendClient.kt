package com.sunagatov.memora.telegrambot

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

data class BackendAcceptedResponse(
    val accepted: Boolean,
    val mindraftId: String
)

class BackendClient(
    private val baseUrl: String,
    private val ingestToken: String
) {
    private val client = HttpClient.newHttpClient()
    private val mapper = jacksonObjectMapper()

    fun sendText(
        telegramUserId: Long,
        telegramChatId: Long,
        telegramMessageId: Long,
        text: String
    ): BackendAcceptedResponse {
        val payload = mapOf(
            "telegramUserId" to telegramUserId,
            "telegramChatId" to telegramChatId,
            "telegramMessageId" to telegramMessageId,
            "text" to text
        )

        return post(payload)
    }

    fun sendVoice(
        telegramUserId: Long,
        telegramChatId: Long,
        telegramMessageId: Long,
        fileId: String,
        fileUniqueId: String,
        durationSeconds: Int?
    ): BackendAcceptedResponse {
        val payload = mapOf(
            "telegramUserId" to telegramUserId,
            "telegramChatId" to telegramChatId,
            "telegramMessageId" to telegramMessageId,
            "voice" to mapOf(
                "fileId" to fileId,
                "fileUniqueId" to fileUniqueId,
                "durationSeconds" to durationSeconds
            )
        )

        return post(payload)
    }

    private fun post(payload: Any): BackendAcceptedResponse {
        val request = HttpRequest.newBuilder()
            .uri(URI.create("${baseUrl.trimEnd('/')}/api/internal/telegram/messages"))
            .header("Content-Type", "application/json")
            .header("X-Bot-Ingest-Token", ingestToken)
            .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
            .build()

        val response = client.send(request, HttpResponse.BodyHandlers.ofString())

        if (response.statusCode() !in 200..299) {
            error("Backend request failed: ${response.statusCode()} ${response.body()}")
        }

        return mapper.readValue(response.body(), BackendAcceptedResponse::class.java)
    }
}
