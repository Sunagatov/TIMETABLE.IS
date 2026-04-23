package com.sunagatov.memora.backend.capture.application

import com.sunagatov.memora.backend.capture.api.TelegramIngestRequest
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import java.util.UUID
import org.springframework.stereotype.Service

@Service
class TelegramCaptureService(
    private val itemStore: ItemStore,
    private val properties: MemoraProperties
) {

    fun ingest(request: TelegramIngestRequest): MemoraItem {
        val now = Instant.now()
        val internalId = UUID.randomUUID().toString()
        val mindraftId = "MDR-${'$'}{now.epochSecond}-${'$'}{internalId.take(8)}"

        val isVoice = request.voice != null
        val rawInputText = request.text?.takeIf { it.isNotBlank() }
        val rawTranscript = null

        val normalizedText = when {
            rawInputText != null -> normalizeText(rawInputText)
            isVoice -> "Voice note received. Transcription is not implemented yet in the bootstrap starter."
            else -> "Empty capture"
        }

        val itemType = when {
            rawInputText == null && isVoice -> ItemType.OTHER
            else -> inferType(normalizedText)
        }

        val title = buildTitle(normalizedText)
        val priority = Priority.NOT_APPLICABLE
        val categoryParts = properties.defaultCategoryPath.split("/")

        val item = MemoraItem(
            id = internalId,
            mindraftId = mindraftId,
            sourceType = if (isVoice) SourceType.TELEGRAM_VOICE else SourceType.TELEGRAM_TEXT,
            telegramUserId = request.telegramUserId,
            telegramChatId = request.telegramChatId,
            telegramMessageId = request.telegramMessageId,
            telegramFileId = request.voice?.fileId,
            telegramFileUniqueId = request.voice?.fileUniqueId,
            rawInputText = rawInputText,
            rawTranscript = rawTranscript,
            aiTitle = title,
            aiCleanedText = normalizedText,
            aiType = itemType,
            aiCategory = categoryParts.getOrElse(0) { "Default" },
            aiSubcategory = categoryParts.getOrElse(1) { "General" },
            aiSubsubcategory = categoryParts.getOrElse(2) { "Inbox" },
            aiPriority = priority,
            title = title,
            cleanedText = normalizedText,
            type = itemType,
            category = categoryParts.getOrElse(0) { "Default" },
            subcategory = categoryParts.getOrElse(1) { "General" },
            subsubcategory = categoryParts.getOrElse(2) { "Inbox" },
            priority = priority,
            status = ItemStatus.AI_PROCESSED_UNREVIEWED,
            createdAt = now,
            updatedAt = now
        )

        return itemStore.save(item)
    }

    private fun normalizeText(raw: String): String =
        raw.trim()
            .replace(Regex("\s+"), " ")
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
