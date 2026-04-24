package com.sunagatov.memora.backend.capture.api

import com.sunagatov.memora.backend.capture.application.TelegramFailureNotificationService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/capture/telegram/failure-notifications")
class TelegramFailureNotificationController(
    private val telegramFailureNotificationService: TelegramFailureNotificationService
) {

    @GetMapping
    fun listPending(): List<TelegramFailureNotificationResponse> =
        telegramFailureNotificationService.listPending()

    @PostMapping("/{notificationId}/delivered")
    fun markDelivered(@PathVariable notificationId: String) {
        telegramFailureNotificationService.markDelivered(notificationId)
    }
}
