package com.sunagatov.memora.backend.category.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.category.model.MemoraCategory
import java.time.Instant
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "categories")
data class MongoCategoryDocument(
    @Id val id: String,
    val category: String,
    val subcategory: String,
    val createdAt: Instant,
    val updatedAt: Instant
)

internal fun MemoraCategory.toDocument() = MongoCategoryDocument(
    id = id,
    category = path.category,
    subcategory = path.subcategory,
    createdAt = createdAt,
    updatedAt = updatedAt
)

internal fun MongoCategoryDocument.toDomain() = MemoraCategory(
    id = id,
    path = CategoryPath(category, subcategory),
    createdAt = createdAt,
    updatedAt = updatedAt
)
