package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.ai.AiTextInput
import com.sunagatov.memora.backend.item.ai.MemoraAiPort
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.store.ItemStore
import com.sunagatov.memora.backend.transcription.application.VoiceTranscriptionService
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.concurrent.ExecutorService

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
        return itemStore.save(ItemProcessingMutations.applyRegeneratedText(item, draft, Instant.now()))
    }

    fun regenerateAnswer(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        require(item.type == ItemType.QUESTION) { "Only QUESTION items can regenerate an answer" }
        val draft = aiPort.generateAnswerDraft(item.cleanedText)
        return itemStore.save(ItemProcessingMutations.applyRegeneratedAnswer(item, draft, Instant.now()))
    }

    fun regenerateCategoryProposal(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val draft = aiPort.generateCategoryDraft(buildAiInput(sourceTextFor(item)))
        return itemStore.save(ItemProcessingMutations.applyRegeneratedCategory(item, draft, Instant.now()))
    }

    fun regenerateAll(itemId: String): MemoraItem {
        val item = requireRegeneratableItem(itemId)
        val draft = aiPort.generateAllDraft(buildAiInput(sourceTextFor(item)))
        return itemStore.save(ItemProcessingMutations.applyRegeneratedAll(item, draft, Instant.now()))
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
                ItemProcessingMutations.applyTranscriptionFailure(
                    item = item,
                    reason = "Voice transcription failed after ${transcriptionOutcome.attempts} attempt(s)${transcriptionOutcome.lastErrorMessageSuffix()}",
                    now = Instant.now()
                )
            )
            return
        }

        val rawTranscript = transcriptionOutcome.value!!
        val transcribedItem = itemStore.save(
            ItemProcessingMutations.applySuccessfulTranscription(item, rawTranscript, Instant.now())
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
        return ItemProcessingMutations.applyAiProcessedDraft(item, draft, rawTranscript, Instant.now())
    }

    private fun failAsAiProcessing(item: MemoraItem, reason: String) {
        itemStore.save(
            ItemProcessingMutations.applyAiProcessingFailure(item, reason, Instant.now())
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
}
