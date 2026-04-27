package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.capture.security.BotIngestTokenFilter
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.config.ProductionConfigValidator
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue
import org.springframework.boot.DefaultApplicationArguments
import org.springframework.mock.env.MockEnvironment
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse

class BackendHardeningTests {

    private companion object {
        const val TELEGRAM_CAPTURE_INGEST_PATH = "/api/capture/telegram/ingest"
        const val TELEGRAM_BOT_TOKEN_HEADER = "X-Memora-Bot-Token"
    }

    @Test
    fun `bot ingest filter does not accept blank configured token`() {
        val filter = BotIngestTokenFilter(testProperties(botIngestToken = ""))
        val request = MockHttpServletRequest("POST", TELEGRAM_CAPTURE_INGEST_PATH)
        val response = MockHttpServletResponse()
        var reachedController = false

        request.addHeader(TELEGRAM_BOT_TOKEN_HEADER, "")
        filter.doFilter(request, response) { _, _ -> reachedController = true }

        assertEquals(500, response.status)
        assertContains(response.contentAsString, "Bot ingest token is not configured")
        assertTrue(!reachedController)
    }

    @Test
    fun `production config rejects plaintext password override`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(
                appPassword = "local-only-password",
                appPasswordHash = "non-default-hash",
                validateProductionConfig = true,
                aiMode = "openai",
                aiApiKey = "ai-key",
                aiApiBaseUrl = "https://api.openai.com",
                aiModel = "gpt-4o-mini",
                aiFallbackToDeterministic = false
            ),
            environment = MockEnvironment().apply { setActiveProfiles("prod") }
        )

        val exception = assertFailsWith<IllegalStateException> {
            validator.run(DefaultApplicationArguments())
        }

        assertContains(exception.message!!, "BACKEND_APP_PASSWORD plaintext override")
    }

    @Test
    fun `production config passes with safe openai settings`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(
                appPasswordHash = "non-default-hash",
                validateProductionConfig = true,
                aiMode = "openai",
                aiApiKey = "ai-key",
                aiApiBaseUrl = "https://api.openai.com",
                aiModel = "gpt-4o-mini",
                aiFallbackToDeterministic = false
            ),
            environment = MockEnvironment()
        )

        validator.run(DefaultApplicationArguments())
    }

    @Test
    fun `production config rejects missing telegram and transcription configuration`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(
                appPasswordHash = "non-default-hash",
                validateProductionConfig = true,
                aiMode = "openai",
                aiApiKey = "ai-key",
                aiApiBaseUrl = "https://api.openai.com",
                aiModel = "gpt-4o-mini",
                aiFallbackToDeterministic = false,
                telegramBotToken = "",
                transcriptionApiKey = ""
            ),
            environment = MockEnvironment()
        )

        val exception = assertFailsWith<IllegalStateException> {
            validator.run(DefaultApplicationArguments())
        }

        assertContains(exception.message!!, "MEMORA_TELEGRAM_BOT_TOKEN")
        assertContains(exception.message!!, "MEMORA_TRANSCRIPTION_API_KEY")
    }

    @Test
    fun `production config rejects deterministic ai mode`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(
                appPasswordHash = "non-default-hash",
                validateProductionConfig = true,
                aiMode = "deterministic",
                aiApiKey = "ai-key",
                aiApiBaseUrl = "https://api.openai.com",
                aiModel = "gpt-4o-mini",
                aiFallbackToDeterministic = false
            ),
            environment = MockEnvironment()
        )

        val exception = assertFailsWith<IllegalStateException> {
            validator.run(DefaultApplicationArguments())
        }

        assertContains(exception.message!!, "MEMORA_AI_MODE must be set to openai")
    }

    @Test
    fun `production config rejects blank ai api key`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(
                appPasswordHash = "non-default-hash",
                validateProductionConfig = true,
                aiMode = "openai",
                aiApiKey = "",
                aiApiBaseUrl = "https://api.openai.com",
                aiModel = "gpt-4o-mini",
                aiFallbackToDeterministic = false
            ),
            environment = MockEnvironment()
        )

        val exception = assertFailsWith<IllegalStateException> {
            validator.run(DefaultApplicationArguments())
        }

        assertContains(exception.message!!, "MEMORA_AI_API_KEY must be set")
    }

    @Test
    fun `production config rejects deterministic fallback`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(
                appPasswordHash = "non-default-hash",
                validateProductionConfig = true,
                aiMode = "openai",
                aiApiKey = "ai-key",
                aiApiBaseUrl = "https://api.openai.com",
                aiModel = "gpt-4o-mini",
                aiFallbackToDeterministic = true
            ),
            environment = MockEnvironment()
        )

        val exception = assertFailsWith<IllegalStateException> {
            validator.run(DefaultApplicationArguments())
        }

        assertContains(exception.message!!, "MEMORA_AI_FALLBACK_TO_DETERMINISTIC must be false")
    }

    @Test
    fun `local deterministic mode remains allowed when production validation is off`() {
        val validator = ProductionConfigValidator(
            properties = testProperties(
                validateProductionConfig = false,
                aiMode = "deterministic",
                aiApiKey = "",
                aiApiBaseUrl = "",
                aiModel = "",
                aiFallbackToDeterministic = true
            ),
            environment = MockEnvironment()
        )

        validator.run(DefaultApplicationArguments())
    }

    private fun testProperties(
        appPassword: String? = null,
        appPasswordHash: String = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
        botIngestToken: String = "bot-token",
        ownerTelegramUserId: String = "owner-1",
        aiMode: String = "deterministic",
        aiApiKey: String = "",
        aiApiBaseUrl: String = "https://api.openai.com",
        aiModel: String = "gpt-4o-mini",
        aiFallbackToDeterministic: Boolean = true,
        telegramBotToken: String = "telegram-bot-token",
        telegramApiBaseUrl: String = "https://api.telegram.org",
        transcriptionApiKey: String = "transcription-key",
        transcriptionApiBaseUrl: String = "https://api.openai.com",
        transcriptionModel: String = "gpt-4o-mini-transcribe",
        transcriptionTimeoutSeconds: Long = 120,
        transcriptionMaxAudioBytes: Long = 25L * 1024L * 1024L,
        transcriptionMaxDurationSeconds: Int = 600,
        validateProductionConfig: Boolean = false
    ): MemoraProperties =
        MemoraProperties(
            http = MemoraProperties.Http(
                allowedOrigin = "http://localhost:5173"
            ),
            auth = MemoraProperties.Auth(
                appPassword = appPassword,
                appPasswordHash = appPasswordHash,
                sessionDays = 30
            ),
            capture = MemoraProperties.Capture(
                botIngestToken = botIngestToken,
                ownerTelegramUserId = ownerTelegramUserId
            ),
            category = MemoraProperties.Category(
                defaultPath = "Default/General"
            ),
            processing = MemoraProperties.Processing(
                transcriptionAutoRetryAttempts = 3,
                aiAutoRetryAttempts = 2
            ),
            telegram = MemoraProperties.Telegram(
                botToken = telegramBotToken,
                apiBaseUrl = telegramApiBaseUrl
            ),
            transcription = MemoraProperties.Transcription(
                apiKey = transcriptionApiKey,
                apiBaseUrl = transcriptionApiBaseUrl,
                model = transcriptionModel,
                timeoutSeconds = transcriptionTimeoutSeconds,
                maxAudioBytes = transcriptionMaxAudioBytes,
                maxDurationSeconds = transcriptionMaxDurationSeconds
            ),
            ai = MemoraProperties.Ai(
                mode = aiMode,
                apiKey = aiApiKey,
                apiBaseUrl = aiApiBaseUrl,
                model = aiModel,
                fallbackToDeterministic = aiFallbackToDeterministic
            ),
            validation = MemoraProperties.Validation(
                productionConfig = validateProductionConfig
            )
        )
}
