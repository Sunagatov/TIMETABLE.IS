package com.sunagatov.memora.backend.capture.application

import com.sunagatov.memora.backend.capture.api.TelegramIngestRequest
import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.application.ItemProcessingService
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.model.TelegramVoiceTrace
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import java.util.UUID
import org.springframework.stereotype.Service

@Service
class TelegramCaptureService(
    private val itemStore: ItemStore,
    private val categoryService: CategoryService,
    private val itemProcessingService: ItemProcessingService,
    private val properties: MemoraProperties
) {

    fun ingest(request: TelegramIngestRequest): MemoraItem {
        validateOwner(request)

        val now = Instant.now()
        val itemId = UUID.randomUUID().toString()
        val rawInputText = request.text?.takeIf { it.isNotBlank() }

        val telegramTrace = TelegramVoiceTrace(
            telegramUserId = request.telegramUserId,
            telegramChatId = request.telegramChatId,
            telegramMessageId = request.telegramMessageId,
            telegramFileId = request.voice?.fileId,
            telegramFileUniqueId = request.voice?.fileUniqueId,
            durationSeconds = request.voice?.durationSeconds,
            mimeType = request.voice?.mimeType
        )

        val item = MemoraItem(
            id = itemId,
            sourceType = if (request.voice != null) SourceType.TELEGRAM_VOICE else SourceType.TELEGRAM_TEXT,
            rawInputText = rawInputText,
            rawTranscript = null,
            aiTitle = "",
            aiCleanedText = "",
            aiType = ItemType.OTHER,
            aiCategoryPath = categoryService.defaultPath(),
            aiPriority = Priority.NOT_APPLICABLE,
            title = "",
            cleanedText = "",
            type = ItemType.OTHER,
            categoryPath = categoryService.defaultPath(),
            priority = Priority.NOT_APPLICABLE,
            status = ItemStatus.RECEIVED,
            failureStage = null,
            failureReason = null,
            telegramTrace = telegramTrace,
            createdAt = now,
            updatedAt = now
        )

        val saved = itemStore.save(item)
        itemProcessingService.enqueue(saved.id)
        return saved
    }

    private fun validateOwner(request: TelegramIngestRequest) {
        val ownerId = properties.ownerTelegramUserId.trim()
        if (ownerId.isBlank()) return
        require(request.telegramUserId == ownerId) {
            "Telegram user is not allowed to ingest items"
        }
    }
}
