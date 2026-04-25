package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.ai.DeterministicMemoraAiPort
import com.sunagatov.memora.backend.item.ai.LangChain4jAiConfig
import com.sunagatov.memora.backend.item.ai.LangChain4jMemoraAiPort
import com.sunagatov.memora.backend.item.ai.MemoraAiPort
import dev.langchain4j.model.chat.ChatModel
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.runner.ApplicationContextRunner
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse

class AiWiringContextTests {

    private val contextRunner = ApplicationContextRunner()
        .withUserConfiguration(AiWiringTestConfig::class.java)
        .withPropertyValues(
            "memora.http.allowed-origin=http://localhost:5173",
            "memora.auth.app-password-hash=\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
            "memora.auth.session-days=30",
            "memora.capture.bot-ingest-token=bot-token",
            "memora.category.default-path=Default/General",
            "memora.capture.owner-telegram-user-id=owner-1",
            "memora.processing.transcription-auto-retry-attempts=3",
            "memora.processing.ai-auto-retry-attempts=2"
        )

    @Test
    fun `default deterministic mode loads without ai api key and uses deterministic port`() {
        contextRunner.run { context ->
            assertEquals(1, context.getBeansOfType(MemoraAiPort::class.java).size)
            assertEquals(1, context.getBeansOfType(DeterministicMemoraAiPort::class.java).size)
            assertFalse(context.containsBean("memoraTextChatModel"))
            assertEquals(
                DeterministicMemoraAiPort::class.java,
                context.getBean(MemoraAiPort::class.java)::class.java
            )
        }
    }

    @Test
    fun `openai mode wires LangChain4j port`() {
        contextRunner
            .withPropertyValues(
                "memora.ai.mode=openai",
                "memora.ai.api-key=test-key",
                "memora.ai.api-base-url=https://api.openai.com",
                "memora.ai.model=gpt-4o-mini",
                "memora.ai.fallback-to-deterministic=false"
            )
            .run { context ->
                assertEquals(1, context.getBeansOfType(MemoraAiPort::class.java).size)
                assertEquals(1, context.getBeansOfType(LangChain4jMemoraAiPort::class.java).size)
                assertEquals(1, context.getBeansOfType(ChatModel::class.java).size)
                assertEquals(
                    LangChain4jMemoraAiPort::class.java,
                    context.getBean(MemoraAiPort::class.java)::class.java
                )
            }
    }
}

@Configuration
@EnableConfigurationProperties(MemoraProperties::class)
@Import(
    DeterministicMemoraAiPort::class,
    LangChain4jAiConfig::class,
    LangChain4jMemoraAiPort::class
)
private class AiWiringTestConfig
