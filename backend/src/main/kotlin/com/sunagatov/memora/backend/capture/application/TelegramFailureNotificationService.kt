package com.sunagatov.memora.backend.capture.application

import com.sunagatov.memora.backend.capture.api.TelegramFailureNotificationResponse
import com.sunagatov.memora.backend.capture.store.FailureNotificationStore
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.store.ItemStore
import org.springframework.stereotype.Service

@Service
class TelegramFailureNotificationService(
    private val itemStore: ItemStore,
    private val notificationStore: FailureNotificationStore,
    private val properties: MemoraProperties
) {

    fun listPending(): List<TelegramFailureNotificationResponse> =
        itemStore.findByStatuses(ItemStatus.failureStatuses())
            .mapNotNull(::toNotification)
            .filterNot { notificationStore.isDelivered(it.notificationId) }

    fun markDelivered(notificationId: String) {
        notificationStore.markDelivered(notificationId)
    }

    private fun toNotification(item: MemoraItem): TelegramFailureNotificationResponse? {
        val telegramChatId = item.telegramTrace?.telegramChatId ?: return null
        val notificationId = notificationIdFor(item)
        val retryContext = buildList {
            add("manualTranscriptionRetries=${item.retryCountTranscription}")
            add("manualAiRetries=${item.retryCountAi}")
            add("autoTranscriptionAttempts=${properties.transcriptionAutoRetryAttempts}")
            add("autoAiAttempts=${properties.aiAutoRetryAttempts}")
        }.joinToString(", ")

        return TelegramFailureNotificationResponse(
            notificationId = notificationId,
            telegramChatId = telegramChatId,
            memoraId = item.id,
            failedStage = item.failureStage?.name ?: "UNKNOWN",
            summary = item.failureReason ?: "Processing failed",
            retryContext = retryContext
        )
    }

    private fun notificationIdFor(item: MemoraItem): String =
        listOf(
            item.id,
            item.status.name,
            item.failureStage?.name ?: "UNKNOWN",
            "transcriptionRetries=${item.retryCountTranscription}",
            "aiRetries=${item.retryCountAi}",
            item.updatedAt.toString()
        ).joinToString(":")
}
