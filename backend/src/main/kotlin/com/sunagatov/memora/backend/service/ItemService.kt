package com.sunagatov.memora.backend.service

import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.domain.ItemStatus
import com.sunagatov.memora.backend.domain.ItemType
import com.sunagatov.memora.backend.domain.MemoraItem
import com.sunagatov.memora.backend.domain.Priority
import com.sunagatov.memora.backend.domain.SourceType
import com.sunagatov.memora.backend.web.TelegramMessageRequest
import java.time.Instant
import java.util.UUID
import org.springframework.stereotype.Service

@Service
class ItemService(
    private val store: ItemStore,
    private val properties: MemoraProperties
) {

    fun ingestTelegramMessage(request: TelegramMessageRequest): MemoraItem {
        val now = Instant.now()
        val id = UUID.randomUUID().toString()
        val mindraftId = "MDR-" + now.epochSecond + "-" + id.take(8)

        val rawText = request.text?.takeIf { it.isNotBlank() }
        val rawTranscript = request.voice?.transcript?.takeIf { it.isNotBlank() }
        val effectiveRaw = rawText ?: rawTranscript ?: "(empty)"

        val cleaned = normalizeText(effectiveRaw)
        val type = inferType(effectiveRaw)
        val title = buildTitle(cleaned)
        val priority = Priority.NOT_APPLICABLE
        val categoryParts = properties.defaultCategoryPath.split("/")
        val item = MemoraItem(
            id = id,
            mindraftId = mindraftId,
            sourceType = if (request.voice != null) SourceType.TELEGRAM_VOICE else SourceType.TELEGRAM_TEXT,
            telegramUserId = request.telegramUserId,
            telegramChatId = request.telegramChatId,
            telegramMessageId = request.telegramMessageId,
            telegramFileId = request.voice?.fileId,
            telegramFileUniqueId = request.voice?.fileUniqueId,
            rawInputText = rawText,
            rawTranscript = rawTranscript,
            aiTitle = title,
            aiCleanedText = cleaned,
            aiType = type,
            aiCategory = categoryParts.getOrElse(0) { "Default" },
            aiSubcategory = categoryParts.getOrElse(1) { "General" },
            aiSubsubcategory = categoryParts.getOrElse(2) { "Inbox" },
            aiPriority = priority,
            title = title,
            cleanedText = cleaned,
            type = type,
            category = categoryParts.getOrElse(0) { "Default" },
            subcategory = categoryParts.getOrElse(1) { "General" },
            subsubcategory = categoryParts.getOrElse(2) { "Inbox" },
            priority = priority,
            status = ItemStatus.AI_PROCESSED_UNREVIEWED,
            createdAt = now,
            updatedAt = now
        )

        return store.save(item)
    }

    fun getNeedsReview(): List<MemoraItem> =
        store.findByStatuses(setOf(ItemStatus.AI_PROCESSED_UNREVIEWED))

    fun getFailures(): List<MemoraItem> =
        store.findByStatuses(setOf(ItemStatus.TRANSCRIPTION_FAILED, ItemStatus.AI_PROCESSING_FAILED))

    fun getApproved(): List<MemoraItem> =
        store.findByStatuses(setOf(ItemStatus.HUMAN_APPROVED, ItemStatus.HUMAN_EDITED_APPROVED))

    private fun normalizeText(raw: String): String =
        raw.trim()
            .replace(Regex("\s+"), " ")
            .replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }

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
