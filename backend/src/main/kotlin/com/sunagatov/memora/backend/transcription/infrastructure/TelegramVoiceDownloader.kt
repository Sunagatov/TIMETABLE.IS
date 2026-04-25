package com.sunagatov.memora.backend.transcription.infrastructure

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.TelegramVoiceTrace
import java.net.URI
import java.net.URLEncoder
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.StandardCharsets
import java.time.Duration
import org.springframework.stereotype.Component

data class DownloadedTelegramVoice(
    val bytes: ByteArray,
    val fileName: String,
    val mimeType: String?
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as DownloadedTelegramVoice

        if (!bytes.contentEquals(other.bytes)) return false
        if (fileName != other.fileName) return false
        if (mimeType != other.mimeType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = bytes.contentHashCode()
        result = 31 * result + fileName.hashCode()
        result = 31 * result + (mimeType?.hashCode() ?: 0)
        return result
    }
}

@Component
class TelegramVoiceDownloader(
    private val properties: MemoraProperties
) {

    private val timeout = Duration.ofSeconds(properties.transcriptionTimeoutSeconds)
    private val httpClient = HttpClient.newBuilder()
        .connectTimeout(timeout)
        .build()
    private val mapper = jacksonObjectMapper()

    fun download(trace: TelegramVoiceTrace): DownloadedTelegramVoice {
        val fileId = trace.telegramFileId?.takeIf { it.isNotBlank() }
            ?: throw IllegalArgumentException("Telegram voice trace is missing fileId")

        val filePath = resolveFilePath(fileId)
        val response = httpClient.send(
            HttpRequest.newBuilder()
                .uri(URI.create("${baseUrl()}/file/bot${properties.telegramBotToken}/${encodeFilePath(filePath)}"))
                .timeout(timeout)
                .GET()
                .build(),
            HttpResponse.BodyHandlers.ofByteArray()
        )

        if (response.statusCode() !in 200..299) {
            throw IllegalStateException(
                "Telegram file download failed with status ${response.statusCode()}"
            )
        }

        return DownloadedTelegramVoice(
            bytes = response.body(),
            fileName = filePath.substringAfterLast('/'),
            mimeType = trace.mimeType
        )
    }

    private fun resolveFilePath(fileId: String): String {
        val encodedFileId = URLEncoder.encode(fileId, StandardCharsets.UTF_8)
        val response = httpClient.send(
            HttpRequest.newBuilder()
                .uri(URI.create("${baseUrl()}/bot${properties.telegramBotToken}/getFile?file_id=$encodedFileId"))
                .timeout(timeout)
                .GET()
                .build(),
            HttpResponse.BodyHandlers.ofString()
        )

        if (response.statusCode() !in 200..299) {
            throw IllegalStateException(
                "Telegram getFile failed with status ${response.statusCode()}"
            )
        }

        val root = mapper.readTree(response.body())
        if (!root.path("ok").asBoolean(false)) {
            throw IllegalStateException("Telegram getFile returned ok=false")
        }

        val filePath = root.path("result").path("file_path").asText().takeIf { it.isNotBlank() }
            ?: throw IllegalStateException("Telegram getFile response did not contain file_path")
        require(!filePath.startsWith("/") && !filePath.contains("..")) {
            "Telegram getFile returned an unsafe file_path"
        }
        return filePath
    }

    private fun baseUrl(): String = properties.telegramApiBaseUrl.trimEnd('/')

    private fun encodeFilePath(filePath: String): String =
        filePath.split("/")
            .joinToString("/") { segment ->
                URLEncoder.encode(segment, StandardCharsets.UTF_8).replace("+", "%20")
            }
}
