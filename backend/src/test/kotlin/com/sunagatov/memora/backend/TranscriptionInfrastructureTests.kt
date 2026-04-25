package com.sunagatov.memora.backend

import com.sun.net.httpserver.HttpExchange
import com.sun.net.httpserver.HttpServer
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.TelegramVoiceTrace
import com.sunagatov.memora.backend.transcription.infrastructure.DownloadedTelegramVoice
import com.sunagatov.memora.backend.transcription.infrastructure.OpenAiAudioTranscriptionClient
import com.sunagatov.memora.backend.transcription.infrastructure.PreparedTranscriptionAudio
import com.sunagatov.memora.backend.transcription.infrastructure.TelegramVoiceDownloader
import com.sunagatov.memora.backend.transcription.infrastructure.TranscriptionAudioPreparer
import java.net.InetSocketAddress
import java.util.concurrent.atomic.AtomicReference
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertContains
import kotlin.test.assertTrue

class TranscriptionInfrastructureTests {

    @Test
    fun `transcription response parser rejects blank transcript`() {
        val client = OpenAiAudioTranscriptionClient(testProperties())

        assertFailsWith<IllegalStateException> {
            client.parseTranscript("""{"text":"   "}""")
        }
        assertFailsWith<IllegalStateException> {
            client.parseTranscript("   ")
        }
    }

    @Test
    fun `transcription client non-2xx error omits response body`() {
        withServer { server ->
            server.createContext("/v1/audio/transcriptions") { exchange ->
                exchange.respond(500, "provider body with sensitive details")
            }

            val client = OpenAiAudioTranscriptionClient(
                testProperties(transcriptionApiBaseUrl = server.baseUrl())
            )

            val exception = assertFailsWith<IllegalStateException> {
                client.transcribe(
                    PreparedTranscriptionAudio(
                        bytes = "audio".toByteArray(),
                        fileName = "voice.wav",
                        contentType = "audio/wav"
                    )
                )
            }

            assertEquals("Transcription API failed with status 500", exception.message)
            assertTrue(!exception.message.orEmpty().contains("sensitive"))
        }
    }

    @Test
    fun `transcription client includes optional language and prompt fields`() {
        withServer { server ->
            val bodyRef = AtomicReference("")
            server.createContext("/v1/audio/transcriptions") { exchange ->
                bodyRef.set(String(exchange.requestBody.readAllBytes(), Charsets.UTF_8))
                exchange.respond(200, "transcript ok")
            }

            val client = OpenAiAudioTranscriptionClient(
                testProperties(
                    transcriptionApiBaseUrl = server.baseUrl(),
                    transcriptionLanguage = "ru",
                    transcriptionPrompt = "Memora, Zufar, Kotlin"
                )
            )

            val transcript = client.transcribe(
                PreparedTranscriptionAudio(
                    bytes = "audio".toByteArray(),
                    fileName = "voice.wav",
                    contentType = "audio/wav"
                )
            )

            assertEquals("transcript ok", transcript)
            assertContains(bodyRef.get(), "name=\"language\"")
            assertContains(bodyRef.get(), "\r\nru\r\n")
            assertContains(bodyRef.get(), "name=\"prompt\"")
            assertContains(bodyRef.get(), "Memora, Zufar, Kotlin")
        }
    }

    @Test
    fun `telegram downloader handles getFile ok false without echoing response body`() {
        withServer { server ->
            server.createContext("/bottelegram-token/getFile") { exchange ->
                exchange.respond(200, """{"ok":false,"description":"do not echo"}""")
            }

            val downloader = TelegramVoiceDownloader(
                testProperties(telegramApiBaseUrl = server.baseUrl())
            )

            val exception = assertFailsWith<IllegalStateException> {
                downloader.download(trace())
            }

            assertEquals("Telegram getFile returned ok=false", exception.message)
            assertTrue(!exception.message.orEmpty().contains("do not echo"))
        }
    }

    @Test
    fun `telegram downloader handles getFile and download non-2xx without echoing response body`() {
        withServer { server ->
            server.createContext("/bottelegram-token/getFile") { exchange ->
                exchange.respond(503, "telegram outage body")
            }

            val getFileDownloader = TelegramVoiceDownloader(
                testProperties(telegramApiBaseUrl = server.baseUrl())
            )

            val getFileException = assertFailsWith<IllegalStateException> {
                getFileDownloader.download(trace())
            }
            assertEquals("Telegram getFile failed with status 503", getFileException.message)
            assertTrue(!getFileException.message.orEmpty().contains("outage"))
        }

        withServer { server ->
            server.createContext("/bottelegram-token/getFile") { exchange ->
                exchange.respond(200, """{"ok":true,"result":{"file_path":"voice/file.oga"}}""")
            }
            server.createContext("/file/bottelegram-token/voice/file.oga") { exchange ->
                exchange.respond(404, "missing file body")
            }

            val downloadDownloader = TelegramVoiceDownloader(
                testProperties(telegramApiBaseUrl = server.baseUrl())
            )

            val downloadException = assertFailsWith<IllegalStateException> {
                downloadDownloader.download(trace())
            }
            assertEquals("Telegram file download failed with status 404", downloadException.message)
            assertTrue(!downloadException.message.orEmpty().contains("missing"))
        }
    }

    @Test
    fun `telegram downloader returns file bytes and metadata on success`() {
        withServer { server ->
            server.createContext("/bottelegram-token/getFile") { exchange ->
                exchange.respond(200, """{"ok":true,"result":{"file_path":"voice/file.oga"}}""")
            }
            server.createContext("/file/bottelegram-token/voice/file.oga") { exchange ->
                exchange.respond(200, "voice-bytes")
            }

            val downloader = TelegramVoiceDownloader(
                testProperties(telegramApiBaseUrl = server.baseUrl())
            )

            val downloaded = downloader.download(trace())

            assertEquals("voice-bytes", downloaded.bytes.toString(Charsets.UTF_8))
            assertEquals("file.oga", downloaded.fileName)
            assertEquals("audio/ogg", downloaded.mimeType)
        }
    }

    @Test
    fun `audio preparer returns supported format directly`() {
        val prepared = TranscriptionAudioPreparer().prepare(
            DownloadedTelegramVoice(
                bytes = "audio".toByteArray(),
                fileName = "voice.wav",
                mimeType = "audio/wav"
            )
        )

        assertEquals("audio", prepared.bytes.toString(Charsets.UTF_8))
        assertEquals("voice.wav", prepared.fileName)
        assertEquals("audio/wav", prepared.contentType)
    }

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

    private fun trace(): TelegramVoiceTrace =
        TelegramVoiceTrace(
            telegramUserId = "owner-1",
            telegramChatId = "chat-1",
            telegramMessageId = "msg-1",
            telegramFileId = "file-id",
            telegramFileUniqueId = "unique-1",
            mimeType = "audio/ogg"
        )

    private fun testProperties(
        telegramApiBaseUrl: String = "https://api.telegram.org",
        transcriptionApiBaseUrl: String = "https://api.openai.com",
        transcriptionLanguage: String = "",
        transcriptionPrompt: String = ""
    ): MemoraProperties =
        MemoraProperties(
            http = MemoraProperties.Http(
                allowedOrigin = "http://localhost:5173"
            ),
            auth = MemoraProperties.Auth(
                appPassword = null,
                appPasswordHash = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
                sessionDays = 30
            ),
            capture = MemoraProperties.Capture(
                botIngestToken = "bot-token",
                ownerTelegramUserId = "owner-1"
            ),
            category = MemoraProperties.Category(
                defaultPath = "Default/General"
            ),
            processing = MemoraProperties.Processing(
                transcriptionAutoRetryAttempts = 3,
                aiAutoRetryAttempts = 2
            ),
            telegram = MemoraProperties.Telegram(
                botToken = "telegram-token",
                apiBaseUrl = telegramApiBaseUrl
            ),
            transcription = MemoraProperties.Transcription(
                apiKey = "transcription-key",
                apiBaseUrl = transcriptionApiBaseUrl,
                language = transcriptionLanguage,
                prompt = transcriptionPrompt,
                timeoutSeconds = 2
            )
        )
}
