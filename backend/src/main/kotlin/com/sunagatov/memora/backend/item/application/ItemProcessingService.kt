package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.ai.AiTextInput
import com.sunagatov.memora.backend.item.ai.MemoraAiPort
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import java.util.concurrent.ExecutorService
import org.springframework.stereotype.Service

@Service
class ItemProcessingService(
    private val itemStore: ItemStore,
    private val categoryService: CategoryService,
    private val aiPort: MemoraAiPort,
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

    fun regenerateCleanedText(itemId: String): MemoraItem = regenerateText(itemId)

    fun regenerateAnswer(itemId: String): MemoraItem = regenerateAnswerInternal(itemId)

    fun regenerateCategoryProposal(itemId: String): MemoraItem = regenerateCategoryInternal(itemId)

    fun regenerateAll(itemId: String): MemoraItem = regenerateAllInternal(itemId)

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

        val outcome = runWithRetries(properties.aiAutoRetryAttempts) {
            val draft = aiPort.generateAllDraft(
                AiTextInput(
                    rawText = rawInputText,
                    existingCategoryPaths = categoryService.list().map { it.path },
                    defaultCategoryPath = categoryService.defaultPath()
                )
            )
            val now = Instant.now()

            itemStore.save(
                item.copy(
                    rawInputText = rawInputText,
                    rawTranscript = null,
                    aiTitle = draft.textDraft.title,
                    aiCleanedText = draft.textDraft.cleanedText,
                    aiType = draft.textDraft.type,
                    aiCategoryPath = draft.categoryDraft.aiCategoryPath,
                    proposedCategoryPath = draft.categoryDraft.proposedCategoryPath,
                    proposedCategoryStatus = draft.categoryDraft.proposedCategoryStatus,
                    aiPriority = draft.textDraft.priority,
                    aiAnswer = draft.answerDraft.answer,
                    title = draft.textDraft.title,
                    cleanedText = draft.textDraft.cleanedText,
                    type = draft.textDraft.type,
                    categoryPath = draft.categoryDraft.currentCategoryPath,
                    priority = draft.textDraft.priority,
                    answer = draft.answerDraft.answer,
                    answerStatus = draft.answerDraft.answerStatus,
                    answerFailureStage = if (draft.answerDraft.answerStatus == AnswerStatus.FAILED) FailureStage.AI_PROCESSING else null,
                    answerFailureReason = draft.answerDraft.failureReason,
                    status = ItemStatus.AI_PROCESSED_UNREVIEWED,
                    failureStage = null,
                    failureReason = null,
                    updatedAt = now
                )
            )
        }

        if (!outcome.success) {
            failAsAiProcessing(
                item,
                "AI processing failed after ${outcome.attempts} attempt(s)" +
                    outcome.lastErrorMessageSuffix()
            )
        }
    }

    private fun processVoice(item: MemoraItem) {
        val outcome = runWithRetries(properties.transcriptionAutoRetryAttempts) {
            throw IllegalStateException("Voice transcription is not implemented in the backend foundation yet")
        }

        if (!outcome.success) {
            itemStore.save(
                item.copy(
                    status = ItemStatus.TRANSCRIPTION_FAILED,
                    failureStage = FailureStage.TRANSCRIPTION,
                    failureReason = buildString {
                        append("Voice transcription is not implemented in the backend foundation yet")
                        append(" after ")
                        append(outcome.attempts)
                        append(" attempt(s)")
                        outcome.lastErrorMessage?.let {
                            append(": ")
                            append(it)
                        }
                    },
                    updatedAt = Instant.now()
                )
            )
        }
    }

    private fun regenerateText(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val sourceText = sourceTextFor(item)
        val draft = aiPort.generateTextDraft(
            AiTextInput(
                rawText = sourceText,
                existingCategoryPaths = categoryService.list().map { it.path },
                defaultCategoryPath = categoryService.defaultPath()
            )
        )

        return itemStore.save(
            item.copy(
                title = draft.title,
                cleanedText = draft.cleanedText,
                updatedAt = Instant.now()
            )
        )
    }

    private fun regenerateAnswerInternal(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        require(item.type == ItemType.QUESTION) { "Only QUESTION items can regenerate an answer" }

        val draft = aiPort.generateAnswerDraft(item.cleanedText)
        val now = Instant.now()
        return itemStore.save(
            item.copy(
                answer = draft.answer,
                answerStatus = draft.answerStatus,
                answerFailureStage = if (draft.answerStatus == AnswerStatus.FAILED) FailureStage.AI_PROCESSING else null,
                answerFailureReason = draft.failureReason,
                updatedAt = now
            )
        )
    }

    private fun regenerateCategoryInternal(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val draft = aiPort.generateCategoryDraft(
            AiTextInput(
                rawText = sourceTextFor(item),
                existingCategoryPaths = categoryService.list().map { it.path },
                defaultCategoryPath = categoryService.defaultPath()
            )
        )

        return itemStore.save(
            item.copy(
                categoryPath = draft.currentCategoryPath,
                proposedCategoryPath = draft.proposedCategoryPath,
                proposedCategoryStatus = draft.proposedCategoryStatus,
                updatedAt = Instant.now()
            )
        )
    }

    private fun regenerateAllInternal(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val draft = aiPort.generateAllDraft(
            AiTextInput(
                rawText = sourceTextFor(item),
                existingCategoryPaths = categoryService.list().map { it.path },
                defaultCategoryPath = categoryService.defaultPath()
            )
        )

        return itemStore.save(
            item.copy(
                title = draft.textDraft.title,
                cleanedText = draft.textDraft.cleanedText,
                type = draft.textDraft.type,
                categoryPath = draft.categoryDraft.currentCategoryPath,
                priority = draft.textDraft.priority,
                answer = draft.answerDraft.answer,
                answerStatus = draft.answerDraft.answerStatus,
                answerFailureStage = if (draft.answerDraft.answerStatus == AnswerStatus.FAILED) FailureStage.AI_PROCESSING else null,
                answerFailureReason = draft.answerDraft.failureReason,
                proposedCategoryPath = draft.categoryDraft.proposedCategoryPath,
                proposedCategoryStatus = draft.categoryDraft.proposedCategoryStatus,
                updatedAt = Instant.now()
            )
        )
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

    private fun requireRegeneratableItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?.takeIf { it.status != ItemStatus.RECEIVED && it.status != ItemStatus.DELETED }
            ?: throw IllegalArgumentException("Item not found or not regeneratable: $itemId")

    private fun sourceTextFor(item: MemoraItem): String =
        item.rawInputText?.takeIf { it.isNotBlank() }
            ?: item.rawTranscript?.takeIf { it.isNotBlank() }
            ?: item.cleanedText

    private data class RetryOutcome(
        val success: Boolean,
        val attempts: Int,
        val lastErrorMessage: String? = null
    )

    private inline fun runWithRetries(
        maxAttempts: Int,
        block: () -> Unit
    ): RetryOutcome {
        require(maxAttempts >= 1) { "Retry attempts must be at least 1" }

        var lastErrorMessage: String? = null
        repeat(maxAttempts) {
            try {
                block()
                return RetryOutcome(success = true, attempts = it + 1)
            } catch (exception: RuntimeException) {
                lastErrorMessage = exception.message
            }
        }

        return RetryOutcome(success = false, attempts = maxAttempts, lastErrorMessage = lastErrorMessage)
    }

    private fun RetryOutcome.lastErrorMessageSuffix(): String =
        lastErrorMessage?.let { ": $it" } ?: ""
}
