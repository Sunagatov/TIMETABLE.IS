package com.sunagatov.memora.backend.item.model

import java.time.Instant

data class MemoraItem(
    val id: String,
    val mindraftId: String,
    val sourceType: SourceType,
    val telegramUserId: String,
    val telegramChatId: String,
    val telegramMessageId: String,
    val telegramFileId: String? = null,
    val telegramFileUniqueId: String? = null,
    val rawInputText: String? = null,
    val rawTranscript: String? = null,
    val aiTitle: String,
    val aiCleanedText: String,
    val aiType: ItemType,
    val aiCategory: String,
    val aiSubcategory: String,
    val aiSubsubcategory: String,
    val aiPriority: Priority,
    val title: String,
    val cleanedText: String,
    val type: ItemType,
    val category: String,
    val subcategory: String,
    val subsubcategory: String,
    val priority: Priority,
    val status: ItemStatus,
    val retryCountTranscription: Int = 0,
    val retryCountAi: Int = 0,
    val failureStage: String? = null,
    val failureReason: String? = null,
    val createdAt: Instant,
    val updatedAt: Instant
)
