package com.sunagatov.memora.backend.item.ai

import dev.langchain4j.model.chat.Capability.RESPONSE_FORMAT_JSON_SCHEMA
import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.openai.OpenAiChatModel
import dev.langchain4j.service.AiServices
import java.time.Duration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class LangChain4jAiConfig {

    @Bean
    fun memoraTextChatModel(properties: com.sunagatov.memora.backend.config.MemoraProperties): ChatModel =
        OpenAiChatModel.builder()
            .apiKey(properties.aiApiKey)
            .baseUrl(properties.aiApiBaseUrl)
            .modelName(properties.aiModel)
            .timeout(Duration.ofSeconds(properties.aiTimeoutSeconds))
            .temperature(0.1)
            .supportedCapabilities(RESPONSE_FORMAT_JSON_SCHEMA)
            .strictJsonSchema(true)
            .logRequests(false)
            .logResponses(false)
            .build()

    @Bean
    internal fun memoraStructuredAiService(chatModel: ChatModel): MemoraStructuredAiService =
        AiServices.builder(MemoraStructuredAiService::class.java)
            .chatModel(chatModel)
            .build()
}
