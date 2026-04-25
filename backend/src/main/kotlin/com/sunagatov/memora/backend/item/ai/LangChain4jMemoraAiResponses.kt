package com.sunagatov.memora.backend.item.ai

import com.fasterxml.jackson.annotation.JsonProperty

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
