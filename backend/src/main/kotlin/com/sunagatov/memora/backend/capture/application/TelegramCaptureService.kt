package com.sunagatov.memora.backend.capture.application

import com.sunagatov.memora.backend.capture.api.TelegramIngestRequest
import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.FailureStage
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
    private val properties: MemoraProperties
) {

    fun ingest(request: TelegramIngestRequest): MemoraItem {
        require(request.telegramUserId == properties.ownerTelegramUserId) {
            "Telegram user is not allowed to ingest items"
        }

        val now = Instant.now()
        val itemId = UUID.randomUUID().toString()
        val isVoice = request.voice != null
        val rawInputText = request.text?.takeIf { it.isNotBlank() }
        val defaultCategoryPath = categoryService.defaultPath()

        val normalizedText = rawInputText?.let(::normalizeText)
        val itemType = normalizedText?.let(::inferType) ?: ItemType.OTHER
        val title = normalizedText?.let(::buildTitle) ?: "Voice note pending transcription"
        val priority = Priority.NOT_APPLICABLE

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
            sourceType = if (isVoice) SourceType.TELEGRAM_VOICE else SourceType.TELEGRAM_TEXT,
            rawInputText = rawInputText,
            rawTranscript = null,
            aiTitle = title,
            aiCleanedText = normalizedText ?: "",
            aiType = itemType,
            aiCategoryPath = defaultCategoryPath,
            aiPriority = priority,
            title = title,
            cleanedText = normalizedText ?: "",
            type = itemType,
            categoryPath = defaultCategoryPath,
            priority = priority,
            status = if (isVoice) ItemStatus.TRANSCRIPTION_FAILED else ItemStatus.AI_PROCESSED_UNREVIEWED,
            failureStage = if (isVoice) FailureStage.TRANSCRIPTION else null,
            failureReason = if (isVoice) "Voice transcription is not implemented in the backend foundation yet" else null,
            telegramTrace = telegramTrace,
            createdAt = now,
            updatedAt = now
        )

        return itemStore.save(item)
    }

    private fun normalizeText(raw: String): String =
        raw.trim()
            .replace(Regex("\\s+"), " ")
            .replaceFirstChar { char ->
                if (char.isLowerCase()) char.titlecase() else char.toString()
            }

    private fun inferType(raw: String): ItemType {
        val text = raw.lowercase()
        return when {
            text.startsWith("remember ") || text.contains(" remind ") -> ItemType.REMINDER
            text.contains(" idea ") || text.startsWith("idea") -> ItemType.IDEA
            text.isNotBlank() -> ItemType.THOUGHT
            else -> ItemType.OTHER
        }
    }

    private fun buildTitle(text: String): String =
        text.split(" ")
            .take(6)
            .joinToString(" ")
            .ifBlank { "Untitled item" }
}
