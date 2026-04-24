package com.sunagatov.memora.backend.item.api

import com.sunagatov.memora.backend.category.api.CategoryPathRequest
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import jakarta.validation.Valid

data class UpdateItemRequest(
    val title: String? = null,
    val cleanedText: String? = null,
    val rawTranscript: String? = null,
    val type: ItemType? = null,
    @field:Valid
    val categoryPath: CategoryPathRequest? = null,
    val priority: Priority? = null
)

data class EditAndApproveRequest(
    val title: String? = null,
    val cleanedText: String? = null,
    val rawTranscript: String? = null,
    val type: ItemType? = null,
    @field:Valid
    val categoryPath: CategoryPathRequest? = null,
    val priority: Priority? = null
) {
    fun toUpdateItemRequest(): UpdateItemRequest =
        UpdateItemRequest(
            title = title,
            cleanedText = cleanedText,
            rawTranscript = rawTranscript,
            type = type,
            categoryPath = categoryPath,
            priority = priority
        )
}
