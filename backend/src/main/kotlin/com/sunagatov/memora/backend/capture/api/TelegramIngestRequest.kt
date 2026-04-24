package com.sunagatov.memora.backend.capture.api

import jakarta.validation.constraints.NotBlank

data class TelegramVoicePayload(
    @field:NotBlank
    val fileId: String,
    @field:NotBlank
    val fileUniqueId: String,
    val durationSeconds: Int? = null,
    val mimeType: String? = null
)

data class TelegramIngestRequest(
    @field:NotBlank
    val telegramUserId: String,
    @field:NotBlank
    val telegramChatId: String,
    @field:NotBlank
    val telegramMessageId: String,
    val text: String? = null,
    val voice: TelegramVoicePayload? = null
) {
    init {
        val hasText = !text.isNullOrBlank()
        val hasVoice = voice != null

        require(hasText.xor(hasVoice)) {
            "Exactly one of text or voice must be provided"
        }
    }
}

data class TelegramIngestAcceptedResponse(
    val memoraId: String
)
