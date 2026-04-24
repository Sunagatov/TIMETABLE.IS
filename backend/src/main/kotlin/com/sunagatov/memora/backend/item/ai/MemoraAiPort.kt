package com.sunagatov.memora.backend.item.ai

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus

data class AiTextInput(
    val rawText: String,
    val existingCategoryPaths: List<CategoryPath>,
    val defaultCategoryPath: CategoryPath
)

data class AiTextDraft(
    val title: String,
    val cleanedText: String,
    val type: ItemType,
    val priority: Priority
)

data class AiCategoryDraft(
    val aiCategoryPath: CategoryPath,
    val proposedCategoryPath: CategoryPath?,
    val proposedCategoryStatus: ProposedCategoryStatus,
    val currentCategoryPath: CategoryPath
)

data class AiAnswerDraft(
    val answer: String?,
    val answerStatus: AnswerStatus,
    val failureReason: String? = null
)

data class AiAllDraft(
    val textDraft: AiTextDraft,
    val categoryDraft: AiCategoryDraft,
    val answerDraft: AiAnswerDraft
)

interface MemoraAiPort {
    fun generateTextDraft(input: AiTextInput): AiTextDraft

    fun generateCategoryDraft(input: AiTextInput): AiCategoryDraft

    fun generateAnswerDraft(cleanedText: String): AiAnswerDraft

    fun generateAllDraft(input: AiTextInput): AiAllDraft
}
