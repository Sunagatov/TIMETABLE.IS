package com.sunagatov.memora.backend.category.api

import com.sunagatov.memora.backend.category.model.CategoryPath
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank

data class CategoryPathRequest(
    @field:NotBlank
    val category: String,
    @field:NotBlank
    val subcategory: String
) {
    fun toCategoryPath(): CategoryPath =
        CategoryPath(
            category = category.trim(),
            subcategory = subcategory.trim()
        )
}

data class CreateCategoryRequest(
    @field:Valid
    val path: CategoryPathRequest
)

data class RenameCategoryRequest(
    @field:Valid
    val path: CategoryPathRequest
)
