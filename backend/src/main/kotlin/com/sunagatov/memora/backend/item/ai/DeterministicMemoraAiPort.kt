package com.sunagatov.memora.backend.item.ai

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
import org.springframework.stereotype.Component

@Component
class DeterministicMemoraAiPort : MemoraAiPort {

    override fun generateTextDraft(input: AiTextInput): AiTextDraft {
        val normalizedText = normalizeText(input.rawText)
        return AiTextDraft(
            title = buildTitle(normalizedText),
            cleanedText = normalizedText,
            type = inferType(normalizedText),
            priority = inferPriority(normalizedText)
        )
    }

    override fun generateCategoryDraft(input: AiTextInput): AiCategoryDraft {
        val normalizedText = normalizeText(input.rawText)
        val existingPath = findExistingPath(normalizedText, input.existingCategoryPaths)
        if (existingPath != null) {
            return AiCategoryDraft(
                aiCategoryPath = existingPath,
                proposedCategoryPath = null,
                proposedCategoryStatus = ProposedCategoryStatus.NONE,
                currentCategoryPath = existingPath
            )
        }

        val proposedPath = proposeCategoryPath(normalizedText)
        return if (proposedPath != null) {
            AiCategoryDraft(
                aiCategoryPath = proposedPath,
                proposedCategoryPath = proposedPath,
                proposedCategoryStatus = ProposedCategoryStatus.PENDING_REVIEW,
                currentCategoryPath = input.defaultCategoryPath
            )
        } else {
            AiCategoryDraft(
                aiCategoryPath = input.defaultCategoryPath,
                proposedCategoryPath = null,
                proposedCategoryStatus = ProposedCategoryStatus.NONE,
                currentCategoryPath = input.defaultCategoryPath
            )
        }
    }

    override fun generateAnswerDraft(cleanedText: String): AiAnswerDraft {
        val normalizedText = normalizeText(cleanedText)
        if (normalizedText.isBlank()) {
            return AiAnswerDraft(
                answer = null,
                answerStatus = AnswerStatus.FAILED,
                failureReason = "Question answer generation failed because the input was blank"
            )
        }

        if (normalizedText.contains("cannot answer", ignoreCase = true) ||
            normalizedText.contains("answer fail", ignoreCase = true)
        ) {
            return AiAnswerDraft(
                answer = null,
                answerStatus = AnswerStatus.FAILED,
                failureReason = "Deterministic AI placeholder could not answer the question"
            )
        }

        return AiAnswerDraft(
            answer = "Model-knowledge placeholder answer: $normalizedText",
            answerStatus = AnswerStatus.GENERATED
        )
    }

    override fun generateAllDraft(input: AiTextInput): AiAllDraft {
        val textDraft = generateTextDraft(input)
        val categoryDraft = generateCategoryDraft(input)
        val answerDraft =
            if (textDraft.type == ItemType.QUESTION) {
                generateAnswerDraft(textDraft.cleanedText)
            } else {
                AiAnswerDraft(answer = null, answerStatus = AnswerStatus.NONE)
            }

        return AiAllDraft(
            textDraft = textDraft,
            categoryDraft = categoryDraft,
            answerDraft = answerDraft
        )
    }

    private fun normalizeText(raw: String): String =
        raw.trim()
            .replace(Regex("\\s+"), " ")
            .replaceFirstChar { char ->
                if (char.isLowerCase()) char.titlecase() else char.toString()
            }

    private fun inferType(raw: String): ItemType {
        val text = raw.lowercase().trim()
        val questionStarters = listOf(
            "what ", "why ", "how ", "who ", "when ", "where ", "which ",
            "is ", "are ", "do ", "does ", "did ", "can ", "could ",
            "should ", "would ", "will ", "was ", "were ", "have ", "has "
        )
        return when {
            text.endsWith("?") || questionStarters.any { text.startsWith(it) } -> ItemType.QUESTION
            text.startsWith("remember ") || text.contains(" remind ") -> ItemType.REMINDER
            text.contains(" idea ") || text.startsWith("idea") -> ItemType.IDEA
            text.isNotBlank() -> ItemType.THOUGHT
            else -> ItemType.OTHER
        }
    }

    private fun inferPriority(raw: String): Priority {
        val text = raw.lowercase()
        return when {
            text.contains("urgent") && text.contains("important") -> Priority.URGENT_IMPORTANT
            text.contains("urgent") -> Priority.URGENT_NOT_IMPORTANT
            text.contains("important") -> Priority.NOT_URGENT_IMPORTANT
            text.contains("later") || text.contains("sometime") -> Priority.NOT_URGENT_NOT_IMPORTANT
            else -> Priority.NOT_APPLICABLE
        }
    }

    private fun findExistingPath(text: String, existingCategoryPaths: List<CategoryPath>): CategoryPath? {
        val normalized = text.lowercase()
        return existingCategoryPaths.firstOrNull { path ->
            val candidate = listOf(path.category, path.subcategory, path.subsubcategory)
                .joinToString(" ")
                .lowercase()
            normalized.contains(candidate) ||
                normalized.contains(path.category.lowercase()) ||
                normalized.contains(path.subcategory.lowercase()) ||
                normalized.contains(path.subsubcategory.lowercase())
        }
    }

    private fun proposeCategoryPath(text: String): CategoryPath? {
        val normalized = text.lowercase()
        return when {
            normalized.contains("question") || normalized.endsWith("?") -> {
                CategoryPath("Questions", "General", "Curiosity")
            }

            normalized.contains("finance") || normalized.contains("money") || normalized.contains("investment") -> {
                CategoryPath("Ideas", "Finance", "Money")
            }

            normalized.contains("health") || normalized.contains("exercise") || normalized.contains("workout") -> {
                CategoryPath("Ideas", "Health", "Improvement")
            }

            normalized.contains("project") || normalized.contains("build") || normalized.contains("feature") -> {
                CategoryPath("Ideas", "Product", "Projects")
            }

            normalized.contains("learn") || normalized.contains("study") || normalized.contains("practice") -> {
                CategoryPath("Ideas", "Learning", "Practice")
            }

            else -> null
        }
    }

    private fun buildTitle(text: String): String =
        text.split(" ")
            .take(6)
            .joinToString(" ")
            .ifBlank { "Untitled item" }
}
