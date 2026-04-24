package com.sunagatov.memora.backend.category.application

import com.sunagatov.memora.backend.category.api.CreateCategoryRequest
import com.sunagatov.memora.backend.category.api.RenameCategoryRequest
import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.category.model.MemoraCategory
import com.sunagatov.memora.backend.category.store.CategoryStore
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import java.util.UUID
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val categoryStore: CategoryStore,
    private val itemStore: ItemStore,
    properties: MemoraProperties
) {
    private val defaultCategoryPath = CategoryPath.fromConfig(properties.defaultCategoryPath)

    init {
        ensureCategoryExists(defaultCategoryPath)
    }

    fun list(): List<MemoraCategory> = categoryStore.findAll()

    fun create(request: CreateCategoryRequest): MemoraCategory {
        val path = request.path.toCategoryPath()
        require(categoryStore.findByPath(path) == null) { "Category path already exists" }

        val category = MemoraCategory(
            id = UUID.randomUUID().toString(),
            path = path,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )
        return categoryStore.save(category)
    }

    fun rename(categoryId: String, request: RenameCategoryRequest): MemoraCategory {
        val existing = requireCategory(categoryId)
        val nextPath = request.path.toCategoryPath()
        val conflicting = categoryStore.findByPath(nextPath)
        require(conflicting == null || conflicting.id == categoryId) { "Category path already exists" }

        itemStore.findByCategoryPath(existing.path).forEach { item ->
            itemStore.save(
                item.copy(
                    categoryPath = nextPath,
                    updatedAt = Instant.now()
                )
            )
        }

        val renamed = existing.copy(
            path = nextPath,
            updatedAt = Instant.now()
        )
        return categoryStore.save(renamed)
    }

    fun delete(categoryId: String) {
        val category = requireCategory(categoryId)
        require(category.path != defaultCategoryPath) { "Default category path cannot be deleted" }
        require(itemStore.countByCategoryPath(category.path) == 0L) { "Category path is not empty" }
        categoryStore.delete(categoryId)
    }

    fun requireExistingPath(path: CategoryPath): CategoryPath {
        ensureCategoryExists(defaultCategoryPath)
        return categoryStore.findByPath(path)?.path
            ?: throw IllegalArgumentException("Category path does not exist")
    }

    fun defaultPath(): CategoryPath {
        ensureCategoryExists(defaultCategoryPath)
        return defaultCategoryPath
    }

    private fun ensureCategoryExists(path: CategoryPath) {
        if (categoryStore.findByPath(path) != null) {
            return
        }

        categoryStore.save(
            MemoraCategory(
                id = UUID.randomUUID().toString(),
                path = path,
                createdAt = Instant.now(),
                updatedAt = Instant.now()
            )
        )
    }

    private fun requireCategory(categoryId: String): MemoraCategory =
        categoryStore.findById(categoryId)
            ?: throw IllegalArgumentException("Category not found: $categoryId")
}
