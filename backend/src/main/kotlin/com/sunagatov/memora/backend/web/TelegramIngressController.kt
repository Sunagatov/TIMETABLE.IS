package com.sunagatov.memora.backend.web

import com.sunagatov.memora.backend.service.ItemService
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

data class TelegramVoicePayload(
    @field:NotBlank
    val fileId: String,
    @field:NotBlank
    val fileUniqueId: String,
    val transcript: String? = null,
    val durationSeconds: Int? = null,
    val mimeType: String? = null
)

data class TelegramMessageRequest(
    @field:NotNull
    val telegramUserId: Long,
    @field:NotNull
    val telegramChatId: Long,
    @field:NotNull
    val telegramMessageId: Long,
    val text: String? = null,
    val voice: TelegramVoicePayload? = null
)

data class TelegramMessageAcceptedResponse(
    val accepted: Boolean,
    val mindraftId: String
)

@RestController
@RequestMapping("/api/internal/telegram")
class TelegramIngressController(
    private val itemService: ItemService
) {

    @PostMapping("/messages")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun ingest(
        @Valid @RequestBody request: TelegramMessageRequest
    ): TelegramMessageAcceptedResponse {
        val item = itemService.ingestTelegramMessage(request)
        return TelegramMessageAcceptedResponse(
            accepted = true,
            mindraftId = item.mindraftId
        )
    }
}
