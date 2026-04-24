package com.sunagatov.memora.backend.category.model

data class CategoryPath(
    val category: String,
    val subcategory: String,
    val subsubcategory: String
) {
    init {
        require(category.isNotBlank()) { "Category level 1 must not be blank" }
        require(subcategory.isNotBlank()) { "Category level 2 must not be blank" }
        require(subsubcategory.isNotBlank()) { "Category level 3 must not be blank" }
    }

    companion object {
        fun fromConfig(value: String): CategoryPath {
            val parts = value.split("/")
                .map { it.trim() }

            require(parts.size == 3) {
                "Default category path must contain exactly 3 levels separated by '/'"
            }

            return CategoryPath(
                category = parts[0],
                subcategory = parts[1],
                subsubcategory = parts[2]
            )
        }
    }
}
