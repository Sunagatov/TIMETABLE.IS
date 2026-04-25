package com.sunagatov.memora.telegrambot.backend

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramAcceptedResponse
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import com.sunagatov.memora.telegrambot.ingest.TelegramIngestRequest
import java.net.URI
import java.net.URLEncoder
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.StandardCharsets
import java.time.Duration

class BackendClient(
    private val settings: BotSettings
) : BackendGateway {
    private val timeout = Duration.ofSeconds(settings.backendTimeoutSeconds)
    private val httpClient = HttpClient.newBuilder()
        .connectTimeout(timeout)
        .build()
    private val mapper = jacksonObjectMapper()

    override fun ingestText(request: TelegramIngestRequest): TelegramAcceptedResponse =
        ingest(request)

    override fun ingestVoice(request: TelegramIngestRequest): TelegramAcceptedResponse =
        ingest(request)

    override fun fetchFailureNotifications(): List<TelegramFailureNotification> {
        val responseBody = send(
            authorizedRequestBuilder(settings.failureNotificationsPath)
                .header("Accept", "application/json")
                .GET()
                .build()
        ).body()

        return parseFailureNotifications(responseBody)
    }

    override fun acknowledgeFailureNotification(notificationId: String) {
        val encodedNotificationId = encodePathSegment(notificationId)
        send(
            authorizedRequestBuilder(settings.failureNotificationAckPathTemplate.format(encodedNotificationId))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build()
        )
    }

    private fun ingest(request: TelegramIngestRequest): TelegramAcceptedResponse =
        post(path = settings.ingestPath, requestBody = request)

    private inline fun <reified T> post(path: String, requestBody: Any): T {
        val payload = mapper.writeValueAsString(requestBody)
        val response = send(
            authorizedRequestBuilder(path)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build()
        )
        return mapper.readValue(response.body())
    }

    private fun parseFailureNotifications(responseBody: String): List<TelegramFailureNotification> =
        when {
            responseBody.isBlank() -> emptyList()
            responseBody.trimStart().startsWith("[") -> mapper.readValue(responseBody)
            else -> {
                val root = mapper.readTree(responseBody)
                root["notifications"]?.let { mapper.readValue(it.toString()) } ?: emptyList()
            }
        }

    private fun send(httpRequest: HttpRequest): HttpResponse<String> =
        try {
            val response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString())
            if (response.statusCode() !in 200..299) {
                throw IllegalStateException(
                    "Backend call failed with status ${response.statusCode()}: ${response.body()}"
                )
            }
            response
        } catch (exception: Exception) {
            throw IllegalStateException(
                "Backend call failed for ${httpRequest.uri()}: ${exception.message ?: "unknown"}",
                exception
            )
        }

    private fun uri(path: String): URI =
        URI.create("${settings.backendBaseUrl}${normalizePath(path)}")

    private fun requestBuilder(path: String): HttpRequest.Builder =
        HttpRequest.newBuilder()
            .uri(uri(path))
            .timeout(timeout)

    private fun authorizedRequestBuilder(path: String): HttpRequest.Builder =
        requestBuilder(path)
            .header(BOT_TOKEN_HEADER, settings.backendBotIngestToken)

    private fun normalizePath(path: String): String =
        if (path.startsWith("/")) path else "/$path"

    private fun encodePathSegment(value: String): String =
        URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20")
}
