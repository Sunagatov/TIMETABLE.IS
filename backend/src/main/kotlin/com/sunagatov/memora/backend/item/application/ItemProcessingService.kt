package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import java.util.concurrent.ExecutorService
import org.springframework.stereotype.Service

@Service
class ItemProcessingService(
    private val itemStore: ItemStore,
    private val categoryService: CategoryService,
    private val properties: MemoraProperties,
    private val executor: ExecutorService
) {

    fun enqueue(itemId: String) {
        executor.submit {
            process(itemId)
        }
    }

    fun retry(itemId: String) {
        enqueue(itemId)
    }

    private fun process(itemId: String) {
        val item = itemStore.findById(itemId) ?: return
        if (item.status != ItemStatus.RECEIVED) {
            return
        }

        when (item.sourceType) {
            SourceType.TELEGRAM_TEXT -> processText(item)
            SourceType.TELEGRAM_VOICE -> processVoice(item)
        }
    }

    private fun processText(item: MemoraItem) {
        val rawInputText = item.rawInputText?.takeIf { it.isNotBlank() }
            ?: return failAsAiProcessing(item, "Accepted text item is missing raw input text")
        val success = runWithRetries(properties.aiAutoRetryAttempts) {
            val normalizedText = normalizeText(rawInputText)
            val itemType = inferType(normalizedText)
            val title = buildTitle(normalizedText)
            val defaultCategoryPath = categoryService.defaultPath()
            val now = Instant.now()

            itemStore.save(
                item.copy(
                    rawInputText = rawInputText,
                    rawTranscript = null,
                    aiTitle = title,
                    aiCleanedText = normalizedText,
                    aiType = itemType,
                    aiCategoryPath = defaultCategoryPath,
                    aiPriority = Priority.NOT_APPLICABLE,
                    title = title,
                    cleanedText = normalizedText,
                    type = itemType,
                    categoryPath = defaultCategoryPath,
                    priority = Priority.NOT_APPLICABLE,
                    status = ItemStatus.AI_PROCESSED_UNREVIEWED,
                    failureStage = null,
                    failureReason = null,
                    updatedAt = now
                )
            )
        }

        if (!success) {
            failAsAiProcessing(item, "AI processing failed after ${properties.aiAutoRetryAttempts} attempts")
        }
    }

    private fun processVoice(item: MemoraItem) {
        val success = runWithRetries(properties.transcriptionAutoRetryAttempts) {
            throw IllegalStateException("Voice transcription is not implemented in the backend foundation yet")
        }

        if (!success) {
            itemStore.save(
                item.copy(
                    status = ItemStatus.TRANSCRIPTION_FAILED,
                    failureStage = FailureStage.TRANSCRIPTION,
                    failureReason = "Voice transcription is not implemented in the backend foundation yet",
                    updatedAt = Instant.now()
                )
            )
        }
    }

    private fun failAsAiProcessing(item: MemoraItem, reason: String) {
        itemStore.save(
            item.copy(
                status = ItemStatus.AI_PROCESSING_FAILED,
                failureStage = FailureStage.AI_PROCESSING,
                failureReason = reason,
                updatedAt = Instant.now()
            )
        )
    }

    private inline fun runWithRetries(
        maxAttempts: Int,
        block: () -> Unit
    ): Boolean {
        require(maxAttempts >= 1) { "Retry attempts must be at least 1" }

        repeat(maxAttempts) {
            try {
                block()
                return true
            } catch (_: RuntimeException) {
                // Try again until the configured retry budget is exhausted.
            }
        }

        return false
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
