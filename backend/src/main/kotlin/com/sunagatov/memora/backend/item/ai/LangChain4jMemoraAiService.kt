package com.sunagatov.memora.backend.item.ai

import dev.langchain4j.service.SystemMessage
import dev.langchain4j.service.UserMessage

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
