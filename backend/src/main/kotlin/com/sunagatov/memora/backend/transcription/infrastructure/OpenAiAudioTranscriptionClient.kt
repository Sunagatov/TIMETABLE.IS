package com.sunagatov.memora.backend.transcription.infrastructure

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.sunagatov.memora.backend.config.MemoraProperties
import java.io.ByteArrayOutputStream
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.StandardCharsets
import java.time.Duration
import java.util.UUID
import org.springframework.stereotype.Component

@Component
class OpenAiAudioTranscriptionClient(
    private val properties: MemoraProperties
) {

    private val mapper = jacksonObjectMapper()
    private val httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(properties.transcriptionTimeoutSeconds))
        .build()

    fun transcribe(audio: PreparedTranscriptionAudio): String {
        val boundary = "memora-${UUID.randomUUID()}"
        val request = HttpRequest.newBuilder()
            .uri(URI.create("${properties.transcriptionApiBaseUrl.trimEnd('/')}/v1/audio/transcriptions"))
            .timeout(Duration.ofSeconds(properties.transcriptionTimeoutSeconds))
            .header("Authorization", "Bearer ${properties.transcriptionApiKey}")
            .header("Content-Type", "multipart/form-data; boundary=$boundary")
            .POST(HttpRequest.BodyPublishers.ofByteArray(buildBody(boundary, audio)))
            .build()

        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        if (response.statusCode() !in 200..299) {
            throw IllegalStateException(
                "Transcription API failed with status ${response.statusCode()}"
            )
        }

        return parseTranscript(response.body())
    }

    fun parseTranscript(responseBody: String): String {
        val trimmed = responseBody.trim()
        if (!trimmed.startsWith("{")) {
            return trimmed.takeIf { it.isNotBlank() }
                ?: throw IllegalStateException("Transcription provider returned a blank transcript")
        }

        val transcript = runCatching {
            val root: JsonNode = mapper.readTree(trimmed)
            root.path("text").asText("").trim()
        }.getOrDefault(trimmed)

        return transcript.takeIf { it.isNotBlank() }
            ?: throw IllegalStateException("Transcription provider returned a blank transcript")
    }

    private fun buildBody(boundary: String, audio: PreparedTranscriptionAudio): ByteArray {
        val buffer = ByteArrayOutputStream()

        appendField(buffer, boundary, "model", properties.transcriptionModel)
        properties.transcriptionLanguage
            .takeIf { it.isNotBlank() }
            ?.let { appendField(buffer, boundary, "language", it) }
        properties.transcriptionPrompt
            .takeIf { it.isNotBlank() }
            ?.let { appendField(buffer, boundary, "prompt", it) }
        appendField(buffer, boundary, "response_format", "text")
        appendFile(buffer, boundary, audio)
        buffer.write("--$boundary--\r\n".toByteArray(StandardCharsets.UTF_8))

        return buffer.toByteArray()
    }

    private fun appendField(
        buffer: ByteArrayOutputStream,
        boundary: String,
        name: String,
        value: String
    ) {
        buffer.write("--$boundary\r\n".toByteArray(StandardCharsets.UTF_8))
        buffer.write("Content-Disposition: form-data; name=\"$name\"\r\n\r\n".toByteArray(StandardCharsets.UTF_8))
        buffer.write(value.toByteArray(StandardCharsets.UTF_8))
        buffer.write("\r\n".toByteArray(StandardCharsets.UTF_8))
    }

    private fun appendFile(
        buffer: ByteArrayOutputStream,
        boundary: String,
        audio: PreparedTranscriptionAudio
    ) {
        buffer.write("--$boundary\r\n".toByteArray(StandardCharsets.UTF_8))
        buffer.write(
            "Content-Disposition: form-data; name=\"file\"; filename=\"${audio.fileName}\"\r\n"
                .toByteArray(StandardCharsets.UTF_8)
        )
        buffer.write("Content-Type: ${audio.contentType}\r\n\r\n".toByteArray(StandardCharsets.UTF_8))
        buffer.write(audio.bytes)
        buffer.write("\r\n".toByteArray(StandardCharsets.UTF_8))
    }
}
