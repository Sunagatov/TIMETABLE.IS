package com.sunagatov.memora.backend.item.ai

import com.sunagatov.memora.backend.config.MemoraProperties
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
        withFallback(
            fallback = { deterministicFallback.generateTextDraft(input) },
            action = {
                LangChain4jMemoraAiMapper.toTextDraft(aiService.generateTextDraft(
                    LangChain4jMemoraAiPrompts.textDraftUserPrompt(input.rawText)
                ), input.rawText)
            }
        )

    override fun generateCategoryDraft(input: AiTextInput): AiCategoryDraft =
        withFallback(
            fallback = { deterministicFallback.generateCategoryDraft(input) },
            action = {
                LangChain4jMemoraAiMapper.toCategoryDraft(aiService.generateCategoryDraft(
                    LangChain4jMemoraAiPrompts.categoryDraftUserPrompt(input)
                ), input)
            }
        )

    override fun generateAnswerDraft(cleanedText: String): AiAnswerDraft =
        withFallback(
            fallback = { deterministicFallback.generateAnswerDraft(cleanedText) },
            action = {
                LangChain4jMemoraAiMapper.toAnswerDraft(aiService.generateQuestionAnswer(
                    LangChain4jMemoraAiPrompts.questionAnswerUserPrompt(cleanedText)
                ))
            }
        )

    override fun generateAllDraft(input: AiTextInput): AiAllDraft =
        withFallback(
            fallback = { deterministicFallback.generateAllDraft(input) },
            action = {
                LangChain4jMemoraAiMapper.toDraft(aiService.generateDraft(
                    LangChain4jMemoraAiPrompts.fullDraftUserPrompt(input)
                ), input)
            }
        )

    private fun <T> withFallback(
        fallback: () -> T,
        action: () -> T
    ): T {
        require(properties.aiApiKey.isNotBlank()) {
            "OpenAI-compatible AI requires MEMORA_AI_API_KEY"
        }

        return try {
            action()
        } catch (exception: Exception) {
            if (!properties.aiFallbackToDeterministic) {
                throw exception
            }
            fallback()
        }
    }
}
