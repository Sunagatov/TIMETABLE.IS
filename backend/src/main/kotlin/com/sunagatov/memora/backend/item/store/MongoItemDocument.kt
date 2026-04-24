package com.sunagatov.memora.backend.item.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.SourceType
import com.sunagatov.memora.backend.item.model.TelegramVoiceTrace
import java.time.Instant
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "items")
data class MongoItemDocument(
    @Id val id: String,
    val sourceType: SourceType,
    val rawInputText: String?,
    val rawTranscript: String?,
    val aiTitle: String,
    val aiCleanedText: String,
    val aiType: ItemType,
    val aiCategoryPath: CategoryPathDocument,
    val aiCategoryPathIsProposal: Boolean = false,
    val aiPriority: Priority,
    val aiAnswer: String?,
    val title: String,
    val cleanedText: String,
    val type: ItemType,
    val categoryPath: CategoryPathDocument,
    val priority: Priority,
    val answer: String?,
    val status: ItemStatus,
    val retryCountTranscription: Int,
    val retryCountAi: Int,
    val failureStage: FailureStage?,
    val failureReason: String?,
    val telegramTrace: TelegramVoiceTraceDocument?,
    val createdAt: Instant,
    val updatedAt: Instant
)

data class CategoryPathDocument(
    val category: String,
    val subcategory: String,
    val subsubcategory: String
)

data class TelegramVoiceTraceDocument(
    val telegramUserId: String,
    val telegramChatId: String,
    val telegramMessageId: String,
    val telegramFileId: String?,
    val telegramFileUniqueId: String?,
    val durationSeconds: Int?,
    val mimeType: String?
)

internal fun MemoraItem.toDocument() = MongoItemDocument(
    id = id,
    sourceType = sourceType,
    rawInputText = rawInputText,
    rawTranscript = rawTranscript,
    aiTitle = aiTitle,
    aiCleanedText = aiCleanedText,
    aiType = aiType,
    aiCategoryPath = aiCategoryPath.toDocument(),
    aiCategoryPathIsProposal = aiCategoryPathIsProposal,
    aiPriority = aiPriority,
    aiAnswer = aiAnswer,
    title = title,
    cleanedText = cleanedText,
    type = type,
    categoryPath = categoryPath.toDocument(),
    priority = priority,
    answer = answer,
    status = status,
    retryCountTranscription = retryCountTranscription,
    retryCountAi = retryCountAi,
    failureStage = failureStage,
    failureReason = failureReason,
    telegramTrace = telegramTrace?.toDocument(),
    createdAt = createdAt,
    updatedAt = updatedAt
)

internal fun MongoItemDocument.toDomain() = MemoraItem(
    id = id,
    sourceType = sourceType,
    rawInputText = rawInputText,
    rawTranscript = rawTranscript,
    aiTitle = aiTitle,
    aiCleanedText = aiCleanedText,
    aiType = aiType,
    aiCategoryPath = aiCategoryPath.toDomain(),
    aiCategoryPathIsProposal = aiCategoryPathIsProposal,
    aiPriority = aiPriority,
    aiAnswer = aiAnswer,
    title = title,
    cleanedText = cleanedText,
    type = type,
    categoryPath = categoryPath.toDomain(),
    priority = priority,
    answer = answer,
    status = status,
    retryCountTranscription = retryCountTranscription,
    retryCountAi = retryCountAi,
    failureStage = failureStage,
    failureReason = failureReason,
    telegramTrace = telegramTrace?.toDomain(),
    createdAt = createdAt,
    updatedAt = updatedAt
)

private fun CategoryPath.toDocument() = CategoryPathDocument(category, subcategory, subsubcategory)
private fun CategoryPathDocument.toDomain() = CategoryPath(category, subcategory, subsubcategory)
private fun TelegramVoiceTrace.toDocument() = TelegramVoiceTraceDocument(
    telegramUserId, telegramChatId, telegramMessageId, telegramFileId, telegramFileUniqueId, durationSeconds, mimeType
)
private fun TelegramVoiceTraceDocument.toDomain() = TelegramVoiceTrace(
    telegramUserId, telegramChatId, telegramMessageId, telegramFileId, telegramFileUniqueId, durationSeconds, mimeType
)
