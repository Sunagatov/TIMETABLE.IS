package com.sunagatov.memora.telegrambot.backend

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.sunagatov.memora.telegrambot.ingest.TelegramIngestRequest
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

class BackendClient(
    private val baseUrl: String,
    private val ingestToken: String
) {
    private val httpClient = HttpClient.newHttpClient()
    private val mapper = jacksonObjectMapper()

    fun ingest(request: TelegramIngestRequest): String {
        val payload = mapper.writeValueAsString(request)

        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl/api/capture/telegram/ingest"))
            .header("Content-Type", "application/json")
            .header("X-Memora-Bot-Token", ingestToken)
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build()

        val response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString())

        if (response.statusCode() !in 200..299) {
            throw IllegalStateException(
                "Backend ingest failed with status ${response.statusCode()}: ${response.body()}"
            )
        }

        val parsed = mapper.readTree(response.body())
        return parsed["mindraftId"]?.asText()
            ?: throw IllegalStateException("Backend response did not contain mindraftId")
    }
}
