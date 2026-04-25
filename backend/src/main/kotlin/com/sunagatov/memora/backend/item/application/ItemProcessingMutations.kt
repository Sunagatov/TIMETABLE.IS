package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.item.ai.AiAllDraft
import com.sunagatov.memora.backend.item.ai.AiAnswerDraft
import com.sunagatov.memora.backend.item.ai.AiCategoryDraft
import com.sunagatov.memora.backend.item.ai.AiTextDraft
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import java.time.Instant

internal object ItemProcessingMutations {

    fun applyRegeneratedText(item: MemoraItem, draft: AiTextDraft, now: Instant): MemoraItem =
        item.copy(
            title = draft.title,
            cleanedText = draft.cleanedText,
            updatedAt = now
        )

    fun applyRegeneratedAnswer(item: MemoraItem, draft: AiAnswerDraft, now: Instant): MemoraItem =
        item.copy(
            answer = draft.answer,
            answerStatus = draft.answerStatus,
            answerFailureStage = draft.toFailureStage(),
            answerFailureReason = draft.failureReason,
            updatedAt = now
        )

    fun applyRegeneratedCategory(item: MemoraItem, draft: AiCategoryDraft, now: Instant): MemoraItem =
        item.copy(
            categoryPath = draft.currentCategoryPath,
            proposedCategoryPath = draft.proposedCategoryPath,
            proposedCategoryStatus = draft.proposedCategoryStatus,
            updatedAt = now
        )

    fun applyRegeneratedAll(item: MemoraItem, draft: AiAllDraft, now: Instant): MemoraItem =
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
            updatedAt = now
        )

    fun applySuccessfulTranscription(item: MemoraItem, rawTranscript: String, now: Instant): MemoraItem =
        item.copy(
            rawTranscript = rawTranscript,
            failureStage = null,
            failureReason = null,
            updatedAt = now
        )

    fun applyAiProcessedDraft(
        item: MemoraItem,
        draft: AiAllDraft,
        rawTranscript: String?,
        now: Instant
    ): MemoraItem =
        item.copy(
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

    fun applyTranscriptionFailure(item: MemoraItem, reason: String, now: Instant): MemoraItem =
        item.copy(
            status = ItemStatus.TRANSCRIPTION_FAILED,
            failureStage = FailureStage.TRANSCRIPTION,
            failureReason = reason,
            updatedAt = now
        )

    fun applyAiProcessingFailure(item: MemoraItem, reason: String, now: Instant): MemoraItem =
        item.copy(
            status = ItemStatus.AI_PROCESSING_FAILED,
            failureStage = FailureStage.AI_PROCESSING,
            failureReason = reason,
            updatedAt = now
        )

    private fun AiAnswerDraft.toFailureStage(): FailureStage? =
        if (answerStatus == AnswerStatus.FAILED) FailureStage.AI_PROCESSING else null
}
