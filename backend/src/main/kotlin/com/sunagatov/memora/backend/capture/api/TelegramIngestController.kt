package com.sunagatov.memora.backend.capture.api

import com.sunagatov.memora.backend.capture.application.TelegramCaptureService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/capture/telegram")
class TelegramIngestController(
    private val telegramCaptureService: TelegramCaptureService
) {

    @PostMapping("/ingest")
    fun ingest(
        @Valid @RequestBody request: TelegramIngestRequest
    ): TelegramIngestAcceptedResponse {
        val item = telegramCaptureService.ingest(request)
        return TelegramIngestAcceptedResponse(mindraftId = item.mindraftId)
    }
}
