package com.sunagatov.memora.backend.item.api

import com.sunagatov.memora.backend.category.api.CategoryPathRequest
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.Priority
import java.time.LocalDate
import jakarta.validation.Valid
import org.springframework.format.annotation.DateTimeFormat

data class UpdateItemRequest(
    val title: String? = null,
    val cleanedText: String? = null,
    val rawTranscript: String? = null,
    val type: ItemType? = null,
    @field:Valid
    val categoryPath: CategoryPathRequest? = null,
    val priority: Priority? = null,
    val answer: String? = null,
    val answerStatus: AnswerStatus? = null
)

data class EditAndApproveRequest(
    val title: String? = null,
    val cleanedText: String? = null,
    val rawTranscript: String? = null,
    val type: ItemType? = null,
    @field:Valid
    val categoryPath: CategoryPathRequest? = null,
    val priority: Priority? = null,
    val answer: String? = null,
    val answerStatus: AnswerStatus? = null
) {
    fun toUpdateItemRequest(): UpdateItemRequest =
        UpdateItemRequest(
            title = title,
            cleanedText = cleanedText,
            rawTranscript = rawTranscript,
            type = type,
            categoryPath = categoryPath,
            priority = priority,
            answer = answer,
            answerStatus = answerStatus
        )
}

data class ItemListQueryRequest(
    val keyword: String? = null,
    val type: ItemType? = null,
    val status: ItemStatus? = null,
    val priority: Priority? = null,
    val category: String? = null,
    val subcategory: String? = null,
    val subsubcategory: String? = null,
    @field:DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    val createdFrom: LocalDate? = null,
    @field:DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    val createdTo: LocalDate? = null,
    val sort: String? = null
) {
    init {
        if (createdFrom != null && createdTo != null) {
            require(!createdFrom.isAfter(createdTo)) {
                "createdFrom must be on or before createdTo"
            }
        }
    }
}
