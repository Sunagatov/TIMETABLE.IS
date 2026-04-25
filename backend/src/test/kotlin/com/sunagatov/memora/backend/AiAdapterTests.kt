package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.ai.AiTextInput
import com.sunagatov.memora.backend.item.ai.LangChain4jCategoryPathResponse
import com.sunagatov.memora.backend.item.ai.LangChain4jMemoraAiPort
import com.sunagatov.memora.backend.item.ai.LangChain4jMemoraAiPrompts
import com.sunagatov.memora.backend.item.ai.LangChain4jQuestionAnswerResponse
import com.sunagatov.memora.backend.item.ai.LangChain4jMemoraAiResponse
import com.sunagatov.memora.backend.item.ai.MemoraStructuredAiService
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

class AiAdapterTests {

    @Test
    fun `adapter maps valid structured output to Memora drafts`() {
        val defaultPath = CategoryPath("Default", "General")
        val existingPath = CategoryPath("Work", "Backend")
        val adapter = adapter {
            LangChain4jMemoraAiResponse(
                title = "Backend note",
                cleanedText = "Backend note with polished English.",
                type = "IDEA",
                priority = "URGENT_IMPORTANT",
                categoryPath = LangChain4jCategoryPathResponse("Work", "Backend"),
                categoryPathIsExisting = true,
                answer = null
            )
        }

        val draft = adapter.generateAllDraft(
            AiTextInput(
                rawText = "backend note",
                existingCategoryPaths = listOf(defaultPath, existingPath),
                defaultCategoryPath = defaultPath
            )
        )

        assertEquals("Backend note", draft.textDraft.title)
        assertEquals("Backend note with polished English.", draft.textDraft.cleanedText)
        assertEquals(ItemType.IDEA, draft.textDraft.type)
        assertEquals(Priority.URGENT_IMPORTANT, draft.textDraft.priority)
        assertEquals(existingPath, draft.categoryDraft.aiCategoryPath)
        assertEquals(existingPath, draft.categoryDraft.currentCategoryPath)
        assertNull(draft.categoryDraft.proposedCategoryPath)
        assertEquals(ProposedCategoryStatus.NONE, draft.categoryDraft.proposedCategoryStatus)
        assertNull(draft.answerDraft.answer)
        assertEquals(AnswerStatus.NONE, draft.answerDraft.answerStatus)
    }

    @Test
    fun `invalid enum values fall back safely`() {
        val defaultPath = CategoryPath("Default", "General")
        val adapter = adapter {
            LangChain4jMemoraAiResponse(
                title = "Odd output",
                cleanedText = "Odd output",
                type = "MAYBE",
                priority = "SOMEDAY",
                categoryPath = LangChain4jCategoryPathResponse("Default", "General")
            )
        }

        val draft = adapter.generateAllDraft(
            AiTextInput(
                rawText = "odd output",
                existingCategoryPaths = listOf(defaultPath),
                defaultCategoryPath = defaultPath
            )
        )

        assertEquals(ItemType.OTHER, draft.textDraft.type)
        assertEquals(Priority.NOT_APPLICABLE, draft.textDraft.priority)
    }

    @Test
    fun `existing category wins even when ai marks it non-existing`() {
        val defaultPath = CategoryPath("Default", "General")
        val existingPath = CategoryPath("Work", "Backend")
        val adapter = adapter {
            LangChain4jMemoraAiResponse(
                title = "Backend note",
                cleanedText = "Backend note",
                type = "IDEA",
                priority = "NOT_APPLICABLE",
                categoryPath = LangChain4jCategoryPathResponse("Work", "Backend"),
                categoryPathIsExisting = false
            )
        }

        val draft = adapter.generateAllDraft(
            AiTextInput(
                rawText = "backend note",
                existingCategoryPaths = listOf(defaultPath, existingPath),
                defaultCategoryPath = defaultPath
            )
        )

        assertEquals(existingPath, draft.categoryDraft.currentCategoryPath)
        assertNull(draft.categoryDraft.proposedCategoryPath)
        assertEquals(ProposedCategoryStatus.NONE, draft.categoryDraft.proposedCategoryStatus)
    }

    @Test
    fun `default category path does not create a proposal`() {
        val defaultPath = CategoryPath("Default", "General")
        val adapter = adapter {
            LangChain4jMemoraAiResponse(
                title = "Uncertain note",
                cleanedText = "Uncertain note",
                type = "THOUGHT",
                priority = "NOT_APPLICABLE",
                categoryPath = LangChain4jCategoryPathResponse("Default", "General"),
                categoryPathIsExisting = false
            )
        }

        val draft = adapter.generateAllDraft(
            AiTextInput(
                rawText = "uncertain note",
                existingCategoryPaths = listOf(defaultPath),
                defaultCategoryPath = defaultPath
            )
        )

        assertEquals(defaultPath, draft.categoryDraft.currentCategoryPath)
        assertNull(draft.categoryDraft.proposedCategoryPath)
        assertEquals(ProposedCategoryStatus.NONE, draft.categoryDraft.proposedCategoryStatus)
    }

    @Test
    fun `question answer behavior remains explicit`() {
        val defaultPath = CategoryPath("Default", "General")
        val withAnswer = adapter {
            LangChain4jMemoraAiResponse(
                title = "Question",
                cleanedText = "What is Kotlin?",
                type = "QUESTION",
                priority = "NOT_APPLICABLE",
                categoryPath = LangChain4jCategoryPathResponse("Default", "General"),
                answer = "A programming language."
            )
        }
        val missingAnswer = adapter {
            LangChain4jMemoraAiResponse(
                title = "Question",
                cleanedText = "What is Kotlin?",
                type = "QUESTION",
                priority = "NOT_APPLICABLE",
                categoryPath = LangChain4jCategoryPathResponse("Default", "General"),
                answer = "   "
            )
        }
        val nonQuestion = adapter {
            LangChain4jMemoraAiResponse(
                title = "Thought",
                cleanedText = "Kotlin has good ergonomics.",
                type = "THOUGHT",
                priority = "NOT_APPLICABLE",
                categoryPath = LangChain4jCategoryPathResponse("Default", "General"),
                answer = "This should be ignored."
            )
        }

        val generated = withAnswer.generateAllDraft(
            AiTextInput("What is Kotlin?", listOf(defaultPath), defaultPath)
        )
        val failed = missingAnswer.generateAllDraft(
            AiTextInput("What is Kotlin?", listOf(defaultPath), defaultPath)
        )
        val none = nonQuestion.generateAllDraft(
            AiTextInput("Kotlin has good ergonomics.", listOf(defaultPath), defaultPath)
        )

        assertEquals(AnswerStatus.GENERATED, generated.answerDraft.answerStatus)
        assertEquals("A programming language.", generated.answerDraft.answer)
        assertEquals(AnswerStatus.FAILED, failed.answerDraft.answerStatus)
        assertContains(failed.answerDraft.failureReason ?: "", "did not return an answer")
        assertEquals(AnswerStatus.NONE, none.answerDraft.answerStatus)
        assertNull(none.answerDraft.answer)
    }

    @Test
    fun `answer regeneration does not depend on reclassification`() {
        val adapter = adapter(
            generateDraft = {
                LangChain4jMemoraAiResponse(
                    title = "Thought",
                    cleanedText = "What is Kotlin?",
                    type = "THOUGHT",
                    priority = "NOT_APPLICABLE",
                    categoryPath = LangChain4jCategoryPathResponse("Default", "General"),
                    answer = null
                )
            },
            generateQuestionAnswer = {
                LangChain4jQuestionAnswerResponse(answer = "A modern programming language.")
            }
        )

        val draft = adapter.generateAnswerDraft("What is Kotlin?")

        assertEquals(AnswerStatus.GENERATED, draft.answerStatus)
        assertEquals("A modern programming language.", draft.answer)
    }

    @Test
    fun `adapter falls back to deterministic output when LangChain4j call fails and fallback is enabled`() {
        val defaultPath = CategoryPath("Default", "General")
        val adapter = adapter(
            properties = testProperties(aiFallbackToDeterministic = true)
        ) {
            throw IllegalStateException("provider unavailable")
        }

        val draft = adapter.generateAllDraft(
            AiTextInput(
                rawText = "What is Kotlin?",
                existingCategoryPaths = listOf(defaultPath),
                defaultCategoryPath = defaultPath
            )
        )

        assertEquals("What is Kotlin?", draft.textDraft.cleanedText)
        assertEquals(ItemType.QUESTION, draft.textDraft.type)
        assertEquals("Model-knowledge placeholder answer: What is Kotlin?", draft.answerDraft.answer)
    }

    @Test
    fun `adapter propagates LangChain4j failures when fallback is disabled`() {
        val adapter = adapter(
            properties = testProperties(aiFallbackToDeterministic = false)
        ) {
            throw IllegalStateException("provider unavailable")
        }

        val exception = assertFailsWith<IllegalStateException> {
            adapter.generateAllDraft(
                AiTextInput(
                    rawText = "hello",
                    existingCategoryPaths = listOf(CategoryPath("Default", "General")),
                    defaultCategoryPath = CategoryPath("Default", "General")
                )
            )
        }

        assertContains(exception.message ?: "", "provider unavailable")
    }

    @Test
    fun `prompt keeps the meaning-preservation rules explicit`() {
        assertContains(LangChain4jMemoraAiPrompts.SYSTEM_MESSAGE, "Do not summarize.")
        assertContains(LangChain4jMemoraAiPrompts.SYSTEM_MESSAGE, "Preserve Zufar's intended meaning as closely as possible.")
        assertContains(LangChain4jMemoraAiPrompts.SYSTEM_MESSAGE, "Do not change opinions or factual claims.")
        assertContains(LangChain4jMemoraAiPrompts.SYSTEM_MESSAGE, "The result should feel like the same thought said by Zufar in excellent, fluent, clear English.")
    }

    private fun adapter(
        properties: MemoraProperties = testProperties(),
        generateQuestionAnswer: (String) -> LangChain4jQuestionAnswerResponse = {
            LangChain4jQuestionAnswerResponse(answer = "Generated answer")
        },
        generateDraft: (String) -> LangChain4jMemoraAiResponse
    ): LangChain4jMemoraAiPort =
        LangChain4jMemoraAiPort(
            properties = properties,
            aiService = object : MemoraStructuredAiService {
                override fun generateDraft(prompt: String): LangChain4jMemoraAiResponse =
                    generateDraft.invoke(prompt)

                override fun generateQuestionAnswer(prompt: String): LangChain4jQuestionAnswerResponse =
                    generateQuestionAnswer.invoke(prompt)
            }
        )

    private fun testProperties(
        aiFallbackToDeterministic: Boolean = true
    ): MemoraProperties =
        MemoraProperties(
            allowedOrigin = "http://localhost:5173",
            appPassword = null,
            appPasswordHash = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
            sessionDays = 30,
            botIngestToken = "bot-token",
            defaultCategoryPath = "Default/General",
            ownerTelegramUserId = "owner-1",
            transcriptionAutoRetryAttempts = 3,
            aiAutoRetryAttempts = 2,
            aiMode = "openai",
            aiApiKey = "ai-key",
            aiApiBaseUrl = "http://localhost:8081",
            aiModel = "gpt-4o-mini",
            aiFallbackToDeterministic = aiFallbackToDeterministic
        )
}
