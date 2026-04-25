package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.ai.AiAnswerDraft
import com.sunagatov.memora.backend.item.ai.AiTextInput
import com.sunagatov.memora.backend.item.ai.MemoraAiPort
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.store.ItemStore
import com.sunagatov.memora.backend.transcription.application.VoiceTranscriptionService
import java.time.Instant
import java.util.concurrent.ExecutorService
import org.springframework.stereotype.Service

@Service
class ItemProcessingService(
    private val itemStore: ItemStore,
    private val categoryService: CategoryService,
    private val aiPort: MemoraAiPort,
    private val voiceTranscriptionService: VoiceTranscriptionService,
    private val properties: MemoraProperties,
    private val executor: ExecutorService
) {
    private val retryRunner = RetryRunner()

    fun enqueue(itemId: String) {
        executor.submit { process(itemId) }
    }

    fun retry(itemId: String) {
        enqueue(itemId)
    }

    fun regenerateCleanedText(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val draft = aiPort.generateTextDraft(buildAiInput(sourceTextFor(item)))
        return itemStore.save(
            item.copy(
                title = draft.title,
                cleanedText = draft.cleanedText,
                updatedAt = Instant.now()
            )
        )
    }

    fun regenerateAnswer(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        require(item.type == ItemType.QUESTION) { "Only QUESTION items can regenerate an answer" }
        val draft = aiPort.generateAnswerDraft(item.cleanedText)
        return itemStore.save(
            item.copy(
                answer = draft.answer,
                answerStatus = draft.answerStatus,
                answerFailureStage = draft.toFailureStage(),
                answerFailureReason = draft.failureReason,
                updatedAt = Instant.now()
            )
        )
    }

    fun regenerateCategoryProposal(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val draft = aiPort.generateCategoryDraft(buildAiInput(sourceTextFor(item)))
        return itemStore.save(
            item.copy(
                categoryPath = draft.currentCategoryPath,
                proposedCategoryPath = draft.proposedCategoryPath,
                proposedCategoryStatus = draft.proposedCategoryStatus,
                updatedAt = Instant.now()
            )
        )
    }

    fun regenerateAll(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val draft = aiPort.generateAllDraft(buildAiInput(sourceTextFor(item)))
        return itemStore.save(
            item.copy(
                title = draft.textDraft.title,
                cleanedText = draft.textDraft.cleanedText,
                type = draft.textDraft.type,
                categoryPath = draft.categoryDraft.currentCategoryPath,
                priority = draft.textDraft.priority,
                answer = draft.answerDraft.answer,
                answerStatus = draft.answerDraft.answerStatus,
                answerFailureStage = draft.answerDraft.toFailureStage(),
                answerFailureReason = draft.answerDraft.failureReason,
                proposedCategoryPath = draft.categoryDraft.proposedCategoryPath,
                proposedCategoryStatus = draft.categoryDraft.proposedCategoryStatus,
                updatedAt = Instant.now()
            )
        )
    }

    private fun process(itemId: String) {
        val item = itemStore.findById(itemId) ?: return
        if (item.status != ItemStatus.RECEIVED) return

        when (item.sourceType) {
            SourceType.TELEGRAM_TEXT -> processText(item)
            SourceType.TELEGRAM_VOICE -> processVoice(item)
        }
    }

    private fun processText(item: MemoraItem) {
        val rawInputText = item.rawInputText?.takeIf { it.isNotBlank() }
            ?: return failAsAiProcessing(item, "Accepted text item is missing raw input text")

        val outcome = retryRunner.run(properties.aiAutoRetryAttempts) {
            createAiProcessedItem(item = item, sourceText = rawInputText, rawTranscript = null)
        }

        if (outcome.success) {
            itemStore.save(outcome.value!!)
            return
        }

        failAsAiProcessing(
            item = item,
            reason = "AI processing failed after ${outcome.attempts} attempt(s)${outcome.lastErrorMessageSuffix()}"
        )
    }

    private fun processVoice(item: MemoraItem) {
        val transcriptionOutcome = retryRunner.run(properties.transcriptionAutoRetryAttempts) {
            voiceTranscriptionService.transcribe(item)
        }

        if (!transcriptionOutcome.success) {
            itemStore.save(
                item.copy(
                    status = ItemStatus.TRANSCRIPTION_FAILED,
                    failureStage = FailureStage.TRANSCRIPTION,
                    failureReason = "Voice transcription failed after ${transcriptionOutcome.attempts} attempt(s)${transcriptionOutcome.lastErrorMessageSuffix()}",
                    updatedAt = Instant.now()
                )
            )
            return
        }

        val rawTranscript = transcriptionOutcome.value!!
        val transcribedItem = itemStore.save(
            item.copy(
                rawTranscript = rawTranscript,
                failureStage = null,
                failureReason = null,
                updatedAt = Instant.now()
            )
        )

        val aiOutcome = retryRunner.run(properties.aiAutoRetryAttempts) {
            createAiProcessedItem(item = transcribedItem, sourceText = rawTranscript, rawTranscript = rawTranscript)
        }

        if (aiOutcome.success) {
            itemStore.save(aiOutcome.value!!)
            return
        }

        failAsAiProcessing(
            item = transcribedItem,
            reason = "AI processing failed after ${aiOutcome.attempts} attempt(s)${aiOutcome.lastErrorMessageSuffix()}"
        )
    }

    private fun createAiProcessedItem(
        item: MemoraItem,
        sourceText: String,
        rawTranscript: String?
    ): MemoraItem {
        val draft = aiPort.generateAllDraft(buildAiInput(sourceText))
        val now = Instant.now()

        return item.copy(
            rawTranscript = rawTranscript,
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
            answerFailureStage = draft.answerDraft.toFailureStage(),
            answerFailureReason = draft.answerDraft.failureReason,
            status = ItemStatus.AI_PROCESSED_UNREVIEWED,
            failureStage = null,
            failureReason = null,
            updatedAt = now
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

    private fun buildAiInput(text: String): AiTextInput = AiTextInput(
        rawText = text,
        existingCategoryPaths = categoryService.list().map { it.path },
        defaultCategoryPath = categoryService.defaultPath()
    )

    private fun AiAnswerDraft.toFailureStage(): FailureStage? =
        if (answerStatus == AnswerStatus.FAILED) FailureStage.AI_PROCESSING else null
}
