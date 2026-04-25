package com.sunagatov.memora.backend.item.ai

import com.fasterxml.jackson.annotation.JsonProperty
import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
import dev.langchain4j.service.SystemMessage
import dev.langchain4j.service.UserMessage
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora.ai", name = ["mode"], havingValue = "openai")
internal class LangChain4jMemoraAiPort(
    private val properties: MemoraProperties,
    private val aiService: MemoraStructuredAiService
) : MemoraAiPort {

    private val deterministicFallback = DeterministicMemoraAiPort()

    override fun generateTextDraft(input: AiTextInput): AiTextDraft =
        requestTextDraft(input)

    override fun generateCategoryDraft(input: AiTextInput): AiCategoryDraft =
        requestCategoryDraft(input)

    override fun generateAnswerDraft(cleanedText: String): AiAnswerDraft =
        requestAnswerDraft(cleanedText)

    override fun generateAllDraft(input: AiTextInput): AiAllDraft =
        requestAllDraft(input)

    private fun requestAllDraft(input: AiTextInput): AiAllDraft {
        require(properties.aiApiKey.isNotBlank()) {
            "OpenAI-compatible AI requires MEMORA_AI_API_KEY"
        }

        return try {
            val response = aiService.generateDraft(
                LangChain4jMemoraAiPrompts.fullDraftUserPrompt(input)
            )
            response.toDraft(input)
        } catch (exception: Exception) {
            if (!properties.aiFallbackToDeterministic) {
                throw exception
            }
            deterministicFallback.generateAllDraft(input)
        }
    }

    private fun requestTextDraft(input: AiTextInput): AiTextDraft {
        require(properties.aiApiKey.isNotBlank()) {
            "OpenAI-compatible AI requires MEMORA_AI_API_KEY"
        }

        return try {
            aiService.generateTextDraft(
                LangChain4jMemoraAiPrompts.textDraftUserPrompt(input.rawText)
            ).toTextDraft()
        } catch (exception: Exception) {
            if (!properties.aiFallbackToDeterministic) {
                throw exception
            }
            deterministicFallback.generateTextDraft(input)
        }
    }

    private fun requestCategoryDraft(input: AiTextInput): AiCategoryDraft {
        require(properties.aiApiKey.isNotBlank()) {
            "OpenAI-compatible AI requires MEMORA_AI_API_KEY"
        }

        return try {
            aiService.generateCategoryDraft(
                LangChain4jMemoraAiPrompts.categoryDraftUserPrompt(input)
            ).toCategoryDraft(input)
        } catch (exception: Exception) {
            if (!properties.aiFallbackToDeterministic) {
                throw exception
            }
            deterministicFallback.generateCategoryDraft(input)
        }
    }

    private fun requestAnswerDraft(cleanedText: String): AiAnswerDraft {
        require(properties.aiApiKey.isNotBlank()) {
            "OpenAI-compatible AI requires MEMORA_AI_API_KEY"
        }

        return try {
            aiService.generateQuestionAnswer(
                LangChain4jMemoraAiPrompts.questionAnswerUserPrompt(cleanedText)
            ).toAnswerDraft()
        } catch (exception: Exception) {
            if (!properties.aiFallbackToDeterministic) {
                throw exception
            }
            deterministicFallback.generateAnswerDraft(cleanedText)
        }
    }

    private fun LangChain4jMemoraAiResponse.toDraft(input: AiTextInput): AiAllDraft {
        val textDraft = toTextDraft()
        val categoryDraft = toCategoryDraft(input)
        val answerDraft = toAnswerDraft(textDraft.type)

        return AiAllDraft(
            textDraft = textDraft,
            categoryDraft = categoryDraft,
            answerDraft = answerDraft
        )
    }

    private fun LangChain4jTextDraftResponse.toTextDraft(): AiTextDraft {
        val normalizedType = type.toItemType()
        return AiTextDraft(
            title = title.requireNonBlank("title").take(120),
            cleanedText = cleanedText.requireNonBlank("cleanedText"),
            type = normalizedType,
            priority = priority.toPriority()
        )
    }

    private fun LangChain4jMemoraAiResponse.toTextDraft(): AiTextDraft =
        LangChain4jTextDraftResponse(
            title = title,
            cleanedText = cleanedText,
            type = type,
            priority = priority
        ).toTextDraft()

    private fun LangChain4jMemoraAiResponse.toCategoryDraft(input: AiTextInput): AiCategoryDraft {
        val path = categoryPath?.toCategoryPath()
            ?: return defaultCategoryDraft(input)
        return path.toCategoryDraft(input)
    }

    private fun LangChain4jCategoryDraftResponse.toCategoryDraft(input: AiTextInput): AiCategoryDraft {
        val path = categoryPath?.toCategoryPath()
            ?: return defaultCategoryDraft(input)
        return path.toCategoryDraft(input)
    }

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

    private fun LangChain4jMemoraAiResponse.toAnswerDraft(type: ItemType): AiAnswerDraft =
        if (type == ItemType.QUESTION) {
            val normalized = answer?.trim().takeIf { !it.isNullOrBlank() }
            if (normalized == null) {
                AiAnswerDraft(
                    answer = null,
                    answerStatus = AnswerStatus.FAILED,
                    failureReason = "AI did not return an answer for QUESTION item"
                )
            } else {
                AiAnswerDraft(answer = normalized, answerStatus = AnswerStatus.GENERATED)
            }
        } else {
            AiAnswerDraft(answer = null, answerStatus = AnswerStatus.NONE)
        }

    private fun LangChain4jQuestionAnswerResponse.toAnswerDraft(): AiAnswerDraft {
        val normalized = answer?.trim().takeIf { !it.isNullOrBlank() }
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

    private fun LangChain4jCategoryPathResponse.toCategoryPath(): CategoryPath =
        CategoryPath(
            category = category.requireNonBlank("categoryPath.category"),
            subcategory = subcategory.requireNonBlank("categoryPath.subcategory")
        )

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

internal interface MemoraStructuredAiService {

    @SystemMessage(LangChain4jMemoraAiPrompts.SYSTEM_MESSAGE)
    fun generateDraft(@UserMessage prompt: String): LangChain4jMemoraAiResponse

    @SystemMessage(LangChain4jMemoraAiPrompts.TEXT_DRAFT_SYSTEM_MESSAGE)
    fun generateTextDraft(@UserMessage prompt: String): LangChain4jTextDraftResponse

    @SystemMessage(LangChain4jMemoraAiPrompts.CATEGORY_DRAFT_SYSTEM_MESSAGE)
    fun generateCategoryDraft(@UserMessage prompt: String): LangChain4jCategoryDraftResponse

    @SystemMessage(LangChain4jMemoraAiPrompts.QUESTION_ANSWER_SYSTEM_MESSAGE)
    fun generateQuestionAnswer(@UserMessage prompt: String): LangChain4jQuestionAnswerResponse
}

internal object LangChain4jMemoraAiPrompts {
    const val SYSTEM_MESSAGE = """
You are Memora's meaning-preserving text polishing and classification adapter.
Return only structured output according to the expected schema.
Clean and polish the text into fluent natural English.
Preserve Zufar's intended meaning as closely as possible.
Do not summarize.
Do not convert the text into short notes.
Do not strongly simplify the thought.
Do not remove complexity just because the original was complex.
Do not change opinions or factual claims.
Do not correct the user's worldview or conclusions.
Do not add moral commentary.
Do not add ideological correction.
Do not add refusal-style meta-commentary into cleanedText.
Do not invent new meaning.
The result should feel like the same thought said by Zufar in excellent, fluent, clear English.
Allowed type values: IDEA, THOUGHT, QUESTION, REMINDER, OTHER.
If type is uncertain, use OTHER.
Allowed priority values: URGENT_IMPORTANT, URGENT_NOT_IMPORTANT, NOT_URGENT_IMPORTANT, NOT_URGENT_NOT_IMPORTANT, NOT_APPLICABLE.
If priority is uncertain, use NOT_APPLICABLE.
Use categoryPath with exactly two fields: category and subcategory.
Prefer an exact existing category/subcategory path when it fits.
If no existing path fits and confidence is high, propose one new two-level path.
If uncertain, use the default category path.
If type is QUESTION, answer from model knowledge only.
If type is not QUESTION, answer must be null.
"""

    const val TEXT_DRAFT_SYSTEM_MESSAGE = """
You are Memora's meaning-preserving text polishing adapter.
Return only structured output according to the expected schema.
Clean and polish the text into fluent natural English.
Preserve Zufar's intended meaning as closely as possible.
Do not summarize.
Do not convert the text into short notes.
Do not strongly simplify the thought.
Do not remove complexity just because the original was complex.
Do not change opinions or factual claims.
Do not correct the user's worldview or conclusions.
Do not add moral commentary.
Do not add ideological correction.
Do not add refusal-style meta-commentary into cleanedText.
Do not invent new meaning.
The result should feel like the same thought said by Zufar in excellent, fluent, clear English.
Allowed type values: IDEA, THOUGHT, QUESTION, REMINDER, OTHER.
If type is uncertain, use OTHER.
Allowed priority values: URGENT_IMPORTANT, URGENT_NOT_IMPORTANT, NOT_URGENT_IMPORTANT, NOT_URGENT_NOT_IMPORTANT, NOT_APPLICABLE.
If priority is uncertain, use NOT_APPLICABLE.
"""

    const val CATEGORY_DRAFT_SYSTEM_MESSAGE = """
You are Memora's category classification adapter.
Return only structured output according to the expected schema.
Use categoryPath with exactly two fields: category and subcategory.
Prefer an exact existing category/subcategory path when it fits.
If no existing path fits and confidence is high, propose one new two-level path.
If uncertain, use the default category path.
"""

    const val QUESTION_ANSWER_SYSTEM_MESSAGE = """
You are Memora's question-answer generation adapter.
The input text is already known to be a QUESTION.
Return only structured output according to the expected schema.
Answer from model knowledge only.
Do not refuse unless you truly cannot answer from model knowledge.
Do not add moral commentary.
Do not add ideological correction.
Do not rewrite the user's question into a different question.
"""

    fun fullDraftUserPrompt(input: AiTextInput): String =
        buildString {
            appendLine("Raw text may be a Whisper transcript or non-native English text.")
            appendLine("Raw text:")
            appendLine(input.rawText)
            appendLine()
            appendLine("Existing category paths:")
            if (input.existingCategoryPaths.isEmpty()) {
                appendLine("- none")
            } else {
                input.existingCategoryPaths.forEach { appendLine("- ${it.category}/${it.subcategory}") }
            }
            appendLine("Default category path: ${input.defaultCategoryPath.category}/${input.defaultCategoryPath.subcategory}")
        }

    fun textDraftUserPrompt(rawText: String): String =
        buildString {
            appendLine("Raw text may be a Whisper transcript or non-native English text.")
            appendLine("Raw text:")
            appendLine(rawText)
        }

    fun categoryDraftUserPrompt(input: AiTextInput): String =
        buildString {
            appendLine("Raw text may be a Whisper transcript or non-native English text.")
            appendLine("Raw text:")
            appendLine(input.rawText)
            appendLine()
            appendLine("Existing category paths:")
            if (input.existingCategoryPaths.isEmpty()) {
                appendLine("- none")
            } else {
                input.existingCategoryPaths.forEach { appendLine("- ${it.category}/${it.subcategory}") }
            }
            appendLine("Default category path: ${input.defaultCategoryPath.category}/${input.defaultCategoryPath.subcategory}")
        }

    fun questionAnswerUserPrompt(cleanedText: String): String =
        buildString {
            appendLine("This text is already known to be a QUESTION.")
            appendLine("Generate an answer from model knowledge only.")
            appendLine("Question text:")
            appendLine(cleanedText)
        }
}

internal data class LangChain4jMemoraAiResponse(
    @param:JsonProperty(required = true)
    val title: String? = null,
    @param:JsonProperty(required = true)
    val cleanedText: String? = null,
    val type: String? = null,
    val priority: String? = null,
    val categoryPath: LangChain4jCategoryPathResponse? = null,
    val categoryPathIsExisting: Boolean? = null,
    val answer: String? = null
)

internal data class LangChain4jTextDraftResponse(
    @param:JsonProperty(required = true)
    val title: String? = null,
    @param:JsonProperty(required = true)
    val cleanedText: String? = null,
    val type: String? = null,
    val priority: String? = null
)

internal data class LangChain4jCategoryDraftResponse(
    val categoryPath: LangChain4jCategoryPathResponse? = null
)

internal data class LangChain4jCategoryPathResponse(
    @param:JsonProperty(required = true)
    val category: String? = null,
    @param:JsonProperty(required = true)
    val subcategory: String? = null
)

internal data class LangChain4jQuestionAnswerResponse(
    @param:JsonProperty(required = true)
    val answer: String? = null
)
