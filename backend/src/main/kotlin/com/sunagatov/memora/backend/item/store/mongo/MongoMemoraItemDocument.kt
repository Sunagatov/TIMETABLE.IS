package com.sunagatov.memora.backend.item.store.mongo

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.model.TelegramVoiceTrace
import java.time.Instant
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("memora_items")
data class MongoMemoraItemDocument(
    @Id
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

internal fun MongoMemoraItemDocument.toDomain(): MemoraItem =
    MemoraItem(
        id = id,
        sourceType = sourceType,
        rawInputText = rawInputText,
        rawTranscript = rawTranscript,
        aiTitle = aiTitle,
        aiCleanedText = aiCleanedText,
        aiType = aiType,
        aiCategoryPath = aiCategoryPath,
        proposedCategoryPath = proposedCategoryPath,
        proposedCategoryStatus = proposedCategoryStatus,
        aiPriority = aiPriority,
        aiAnswer = aiAnswer,
        title = title,
        cleanedText = cleanedText,
        type = type,
        categoryPath = categoryPath,
        priority = priority,
        answer = answer,
        answerStatus = answerStatus,
        answerFailureStage = answerFailureStage,
        answerFailureReason = answerFailureReason,
        status = status,
        retryCountTranscription = retryCountTranscription,
        retryCountAi = retryCountAi,
        failureStage = failureStage,
        failureReason = failureReason,
        telegramTrace = telegramTrace,
        createdAt = createdAt,
        updatedAt = updatedAt
    )

internal fun MemoraItem.toDocument(): MongoMemoraItemDocument =
    MongoMemoraItemDocument(
        id = id,
        sourceType = sourceType,
        rawInputText = rawInputText,
        rawTranscript = rawTranscript,
        aiTitle = aiTitle,
        aiCleanedText = aiCleanedText,
        aiType = aiType,
        aiCategoryPath = aiCategoryPath,
        proposedCategoryPath = proposedCategoryPath,
        proposedCategoryStatus = proposedCategoryStatus,
        aiPriority = aiPriority,
        aiAnswer = aiAnswer,
        title = title,
        cleanedText = cleanedText,
        type = type,
        categoryPath = categoryPath,
        priority = priority,
        answer = answer,
        answerStatus = answerStatus,
        answerFailureStage = answerFailureStage,
        answerFailureReason = answerFailureReason,
        status = status,
        retryCountTranscription = retryCountTranscription,
        retryCountAi = retryCountAi,
        failureStage = failureStage,
        failureReason = failureReason,
        telegramTrace = telegramTrace,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
