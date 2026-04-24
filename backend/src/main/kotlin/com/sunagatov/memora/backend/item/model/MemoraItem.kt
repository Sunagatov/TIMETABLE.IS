package com.sunagatov.memora.backend.item.model

import com.sunagatov.memora.backend.category.model.CategoryPath
import java.time.Instant

data class TelegramVoiceTrace(
    val telegramUserId: String,
    val telegramChatId: String,
    val telegramMessageId: String,
    val telegramFileId: String? = null,
    val telegramFileUniqueId: String? = null,
    val durationSeconds: Int? = null,
    val mimeType: String? = null
)

data class MemoraItem(
    val id: String,
    val sourceType: SourceType,
    val rawInputText: String? = null,
    val rawTranscript: String? = null,
    val aiTitle: String,
    val aiCleanedText: String,
    val aiType: ItemType,
    val aiCategoryPath: CategoryPath,
    val proposedCategoryPath: CategoryPath? = null,
    val proposedCategoryStatus: ProposedCategoryStatus = ProposedCategoryStatus.NONE,
    val aiPriority: Priority,
    val aiAnswer: String? = null,
    val title: String,
    val cleanedText: String,
    val type: ItemType,
    val categoryPath: CategoryPath,
    val priority: Priority,
    val answer: String? = null,
    val answerStatus: AnswerStatus = AnswerStatus.NONE,
    val answerFailureStage: FailureStage? = null,
    val answerFailureReason: String? = null,
    val status: ItemStatus,
    val retryCountTranscription: Int = 0,
    val retryCountAi: Int = 0,
    val failureStage: FailureStage? = null,
    val failureReason: String? = null,
    val telegramTrace: TelegramVoiceTrace? = null,
    val createdAt: Instant,
    val updatedAt: Instant
)
