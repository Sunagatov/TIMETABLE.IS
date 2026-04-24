package com.sunagatov.memora.telegrambot.backend

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramAcceptedResponse
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import com.sunagatov.memora.telegrambot.ingest.TelegramTextIngestRequest
import com.sunagatov.memora.telegrambot.ingest.TelegramVoiceIngestRequest
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

class BackendClient(
    private val settings: BotSettings
) {
    private val httpClient = HttpClient.newHttpClient()
    private val mapper = jacksonObjectMapper()

    fun ingestText(request: TelegramTextIngestRequest): TelegramAcceptedResponse =
        post(
            path = settings.textCapturePath,
            requestBody = request
        )

    fun ingestVoice(request: TelegramVoiceIngestRequest): TelegramAcceptedResponse =
        post(
            path = settings.voiceCapturePath,
            requestBody = request
        )

    fun fetchFailureNotifications(): List<TelegramFailureNotification> {
        val response = send(
            HttpRequest.newBuilder()
                .uri(uri(settings.failureNotificationsPath))
                .header("Accept", "application/json")
                .header("X-Memora-Bot-Token", settings.backendBotIngestToken)
                .GET()
                .build()
        )

        return when {
            response.body().isBlank() -> emptyList()
            response.body().trimStart().startsWith("[") -> mapper.readValue(response.body())
            else -> {
                val root = mapper.readTree(response.body())
                root["notifications"]?.let { mapper.readValue(it.toString()) } ?: emptyList()
            }
        }
    }

    fun acknowledgeFailureNotification(notificationId: String) {
        send(
            HttpRequest.newBuilder()
                .uri(uri(settings.failureNotificationAckPathTemplate.format(notificationId)))
                .header("X-Memora-Bot-Token", settings.backendBotIngestToken)
                .POST(HttpRequest.BodyPublishers.noBody())
                .build()
        )
    }

    private inline fun <reified T> post(path: String, requestBody: Any): T {
        val payload = mapper.writeValueAsString(requestBody)
        val response = send(
            HttpRequest.newBuilder()
                .uri(uri(path))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("X-Memora-Bot-Token", settings.backendBotIngestToken)
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build()
        )
        return mapper.readValue(response.body())
    }

    private fun send(httpRequest: HttpRequest): HttpResponse<String> {
        val response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString())
        if (response.statusCode() !in 200..299) {
            throw IllegalStateException(
                "Backend call failed with status ${response.statusCode()}: ${response.body()}"
            )
        }
        return response
    }

    private fun uri(path: String): URI =
        HttpRequest.newBuilder()
            .uri(URI.create("${settings.backendBaseUrl.trimEnd('/')}$path"))
            .build()
            .uri()
}
