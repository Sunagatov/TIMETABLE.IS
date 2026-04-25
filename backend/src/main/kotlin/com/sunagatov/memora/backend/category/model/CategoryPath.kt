package com.sunagatov.memora.backend.category.model

data class CategoryPath(
    val category: String,
    val subcategory: String
) {
    init {
        require(category.isNotBlank()) { "Category level 1 must not be blank" }
        require(subcategory.isNotBlank()) { "Category level 2 must not be blank" }
    }

    companion object {
        fun fromConfig(value: String): CategoryPath {
            val parts = value.split("/")
                .map { it.trim() }

            require(parts.size == 2 || parts.size == 3) {
                "Default category path must contain exactly 2 levels or legacy 3 levels separated by '/'"
            }
            require(parts.all { it.isNotEmpty() }) {
                "Default category path must not contain blank segments"
            }

            return CategoryPath(
                category = parts[0],
                subcategory = parts[1]
            )
        }
    }
}
