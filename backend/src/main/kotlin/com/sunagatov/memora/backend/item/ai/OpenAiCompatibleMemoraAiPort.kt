package com.sunagatov.memora.backend.item.ai

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora", name = ["ai-mode"], havingValue = "openai")
class OpenAiCompatibleMemoraAiPort(
    private val properties: MemoraProperties
) : MemoraAiPort {

    private val mapper = jacksonObjectMapper()
    private val deterministicFallback = DeterministicMemoraAiPort()
    private val httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(properties.aiTimeoutSeconds))
        .build()

    override fun generateTextDraft(input: AiTextInput): AiTextDraft =
        generateAllDraft(input).textDraft

    override fun generateCategoryDraft(input: AiTextInput): AiCategoryDraft =
        generateAllDraft(input).categoryDraft

    override fun generateAnswerDraft(cleanedText: String): AiAnswerDraft =
        requestDraft(
            input = AiTextInput(
                rawText = cleanedText,
                existingCategoryPaths = emptyList(),
                defaultCategoryPath = CategoryPath("Default", "General")
            ),
            includeCategory = false
        ).answerDraft

    override fun generateAllDraft(input: AiTextInput): AiAllDraft =
        requestDraft(input = input, includeCategory = true)

    private fun requestDraft(input: AiTextInput, includeCategory: Boolean): AiAllDraft {
        require(properties.aiApiKey.isNotBlank()) {
            "OpenAI-compatible AI requires MEMORA_AI_API_KEY"
        }

        return try {
            val content = callChatCompletions(buildPrompt(input, includeCategory))
            parseDraft(content, input, includeCategory)
        } catch (exception: Exception) {
            if (!properties.aiFallbackToDeterministic) {
                throw exception
            }
            deterministicFallback.generateAllDraft(input)
        }
    }

    private fun callChatCompletions(prompt: String): String {
        val body = mapper.writeValueAsBytes(
            mapOf(
                "model" to properties.aiModel,
                "response_format" to mapOf("type" to "json_object"),
                "messages" to listOf(
                    mapOf("role" to "system", "content" to SYSTEM_PROMPT),
                    mapOf("role" to "user", "content" to prompt)
                )
            )
        )

        val request = HttpRequest.newBuilder()
            .uri(URI.create("${properties.aiApiBaseUrl.trimEnd('/')}/v1/chat/completions"))
            .timeout(Duration.ofSeconds(properties.aiTimeoutSeconds))
            .header("Authorization", "Bearer ${properties.aiApiKey}")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofByteArray(body))
            .build()

        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        if (response.statusCode() !in 200..299) {
            throw IllegalStateException("AI API failed with status ${response.statusCode()}")
        }

        val root = mapper.readTree(response.body())
        return root.path("choices").firstOrNull()
            ?.path("message")
            ?.path("content")
            ?.asText()
            ?.takeIf { it.isNotBlank() }
            ?: throw IllegalStateException("AI API response did not contain message content")
    }

    private fun parseDraft(content: String, input: AiTextInput, includeCategory: Boolean): AiAllDraft {
        val root = mapper.readTree(stripJsonFence(content))
        val textDraft = AiTextDraft(
            title = requiredText(root, "title").take(120),
            cleanedText = requiredText(root, "cleanedText"),
            type = parseEnum(root.path("type").asText(), ItemType.OTHER),
            priority = parseEnum(root.path("priority").asText(), Priority.NOT_APPLICABLE)
        )
        val categoryDraft = if (includeCategory) {
            parseCategory(root.path("categoryPath"), root.path("categoryPathIsExisting").asBoolean(false), input)
        } else {
            AiCategoryDraft(
                aiCategoryPath = input.defaultCategoryPath,
                proposedCategoryPath = null,
                proposedCategoryStatus = ProposedCategoryStatus.NONE,
                currentCategoryPath = input.defaultCategoryPath
            )
        }
        val answerDraft = if (textDraft.type == ItemType.QUESTION) {
            val answer = root.path("answer").asText("").trim().takeIf { it.isNotBlank() }
            if (answer == null) {
                AiAnswerDraft(
                    answer = null,
                    answerStatus = AnswerStatus.FAILED,
                    failureReason = "AI did not return an answer for QUESTION item"
                )
            } else {
                AiAnswerDraft(answer = answer, answerStatus = AnswerStatus.GENERATED)
            }
        } else {
            AiAnswerDraft(answer = null, answerStatus = AnswerStatus.NONE)
        }

        return AiAllDraft(textDraft = textDraft, categoryDraft = categoryDraft, answerDraft = answerDraft)
    }

    private fun parseCategory(node: JsonNode, isExisting: Boolean, input: AiTextInput): AiCategoryDraft {
        val parsed = CategoryPath(
            category = requiredText(node, "category"),
            subcategory = requiredText(node, "subcategory")
        )
        val existing = input.existingCategoryPaths.firstOrNull { it == parsed }

        if (isExisting && existing != null) {
            return AiCategoryDraft(
                aiCategoryPath = existing,
                proposedCategoryPath = null,
                proposedCategoryStatus = ProposedCategoryStatus.NONE,
                currentCategoryPath = existing
            )
        }

        return AiCategoryDraft(
            aiCategoryPath = parsed,
            proposedCategoryPath = parsed,
            proposedCategoryStatus = ProposedCategoryStatus.PENDING_REVIEW,
            currentCategoryPath = input.defaultCategoryPath
        )
    }

    private fun buildPrompt(input: AiTextInput, includeCategory: Boolean): String =
        buildString {
            appendLine("Return only JSON with keys: title, cleanedText, type, priority, categoryPath, categoryPathIsExisting, answer.")
            appendLine("Allowed type values: ${ItemType.entries.joinToString()}.")
            appendLine("Allowed priority values: ${Priority.entries.joinToString()}.")
            appendLine("Clean and polish the text into fluent natural English.")
            appendLine("Preserve Zufar's intended meaning as closely as possible.")
            appendLine("Do not summarize.")
            appendLine("Do not convert the text into short notes.")
            appendLine("Do not strongly simplify the thought.")
            appendLine("Do not remove complexity just because the original was complex.")
            appendLine("Do not change opinions or factual claims.")
            appendLine("Do not correct the user's worldview or conclusions.")
            appendLine("Do not add moral commentary.")
            appendLine("Do not add ideological correction.")
            appendLine("Do not add refusal-style meta-commentary into the cleaned text.")
            appendLine("Do not invent new meaning.")
            appendLine("The result should feel like the same thought said by Zufar in excellent, fluent, clear English.")
            if (includeCategory) {
                appendLine("Use categoryPath with exactly two fields: category and subcategory.")
                appendLine("Prefer one exact existing two-level category path when it fits.")
                appendLine("Existing category paths: ${input.existingCategoryPaths.joinToString { it.asPromptPath() }}")
                appendLine("Default category path: ${input.defaultCategoryPath.asPromptPath()}")
                appendLine("If no existing path fits and confidence is high, propose exactly one new two-level path and set categoryPathIsExisting false.")
                appendLine("If uncertain, use the default category path and set categoryPathIsExisting true only when it already exists.")
            }
            appendLine("If type is uncertain, use OTHER.")
            appendLine("If priority is uncertain, use NOT_APPLICABLE.")
            appendLine("If type is QUESTION, answer from model knowledge only. Otherwise answer must be null.")
            appendLine("User text:")
            append(input.rawText)
        }

    private fun requiredText(node: JsonNode, fieldName: String): String =
        node.path(fieldName).asText("").trim().takeIf { it.isNotBlank() }
            ?: throw IllegalStateException("AI JSON missing non-blank field: $fieldName")

    private inline fun <reified T : Enum<T>> parseEnum(value: String, defaultValue: T): T =
        enumValues<T>().firstOrNull { it.name == value.trim().uppercase() } ?: defaultValue

    private fun stripJsonFence(content: String): String =
        content.trim()
            .removePrefix("```json")
            .removePrefix("```")
            .removeSuffix("```")
            .trim()

    private fun CategoryPath.asPromptPath(): String =
        "$category/$subcategory"

    private companion object {
        const val SYSTEM_PROMPT =
            "You are Memora's text cleanup and classification adapter. You produce strict JSON only."
    }
}
