package com.sunagatov.memora.backend.item.ai

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus

internal object LangChain4jMemoraAiMapper {

    fun toDraft(response: LangChain4jMemoraAiResponse, input: AiTextInput): AiAllDraft {
        val textDraft = response.toTextDraft()
        return AiAllDraft(
            textDraft = textDraft,
            categoryDraft = response.toCategoryDraft(input),
            answerDraft = response.toAnswerDraft(textDraft.type)
        )
    }

    fun toTextDraft(response: LangChain4jTextDraftResponse): AiTextDraft {
        val normalizedType = response.type.toItemType()
        return AiTextDraft(
            title = response.title.requireNonBlank("title").take(120),
            cleanedText = response.cleanedText.requireNonBlank("cleanedText"),
            type = normalizedType,
            priority = response.priority.toPriority()
        )
    }

    fun toCategoryDraft(response: LangChain4jCategoryDraftResponse, input: AiTextInput): AiCategoryDraft =
        response.categoryPath?.toCategoryPath()?.toCategoryDraft(input) ?: defaultCategoryDraft(input)

    fun toAnswerDraft(response: LangChain4jQuestionAnswerResponse): AiAnswerDraft {
        val normalized = response.answer?.trim().takeIf { !it.isNullOrBlank() }
        return if (normalized == null) {
            AiAnswerDraft(
                answer = null,
                answerStatus = AnswerStatus.FAILED,
                failureReason = "AI did not return an answer for QUESTION item"
            )
        } else {
            AiAnswerDraft(answer = normalized, answerStatus = AnswerStatus.GENERATED)
        }
    }

    private fun LangChain4jMemoraAiResponse.toTextDraft(): AiTextDraft =
        toTextDraft(
            LangChain4jTextDraftResponse(
                title = title,
                cleanedText = cleanedText,
                type = type,
                priority = priority
            )
        )

    private fun LangChain4jMemoraAiResponse.toCategoryDraft(input: AiTextInput): AiCategoryDraft =
        categoryPath?.toCategoryPath()?.toCategoryDraft(input) ?: defaultCategoryDraft(input)

    private fun LangChain4jMemoraAiResponse.toAnswerDraft(type: ItemType): AiAnswerDraft =
        if (type == ItemType.QUESTION) {
            toAnswerDraft(LangChain4jQuestionAnswerResponse(answer = answer))
        } else {
            AiAnswerDraft(answer = null, answerStatus = AnswerStatus.NONE)
        }

    private fun LangChain4jCategoryPathResponse.toCategoryPath(): CategoryPath =
        CategoryPath(
            category = category.requireNonBlank("categoryPath.category"),
            subcategory = subcategory.requireNonBlank("categoryPath.subcategory")
        )

    private fun CategoryPath.toCategoryDraft(input: AiTextInput): AiCategoryDraft {
        val existing = input.existingCategoryPaths.firstOrNull { it == this }
        if (existing != null) {
            return AiCategoryDraft(
                aiCategoryPath = existing,
                proposedCategoryPath = null,
                proposedCategoryStatus = ProposedCategoryStatus.NONE,
                currentCategoryPath = existing
            )
        }

        if (this == input.defaultCategoryPath) {
            return defaultCategoryDraft(input)
        }

        return AiCategoryDraft(
            aiCategoryPath = this,
            proposedCategoryPath = this,
            proposedCategoryStatus = ProposedCategoryStatus.PENDING_REVIEW,
            currentCategoryPath = input.defaultCategoryPath
        )
    }

    private fun defaultCategoryDraft(input: AiTextInput): AiCategoryDraft =
        AiCategoryDraft(
            aiCategoryPath = input.defaultCategoryPath,
            proposedCategoryPath = null,
            proposedCategoryStatus = ProposedCategoryStatus.NONE,
            currentCategoryPath = input.defaultCategoryPath
        )

    private fun String?.requireNonBlank(fieldName: String): String =
        this?.trim()?.takeIf { it.isNotBlank() }
            ?: throw IllegalStateException("AI response missing non-blank field: $fieldName")

    private fun String?.toItemType(): ItemType =
        ItemType.entries.firstOrNull { it.name == this?.trim()?.uppercase() } ?: ItemType.OTHER

    private fun String?.toPriority(): Priority =
        Priority.entries.firstOrNull { it.name == this?.trim()?.uppercase() } ?: Priority.NOT_APPLICABLE
}
