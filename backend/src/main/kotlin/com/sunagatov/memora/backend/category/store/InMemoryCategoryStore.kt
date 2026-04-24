package com.sunagatov.memora.backend.category.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.category.model.MemoraCategory
import java.util.concurrent.ConcurrentHashMap
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora.storage", name = ["mode"], havingValue = "in-memory")
class InMemoryCategoryStore : CategoryStore {

    private val categories = ConcurrentHashMap<String, MemoraCategory>()

    override fun save(category: MemoraCategory): MemoraCategory {
        categories[category.id] = category
        return category
    }

    override fun findAll(): List<MemoraCategory> =
        categories.values.sortedWith(
            compareBy(
                { it.path.category.lowercase() },
                { it.path.subcategory.lowercase() },
                { it.path.subsubcategory.lowercase() }
            )
        )

    override fun findById(id: String): MemoraCategory? = categories[id]

    override fun findByPath(path: CategoryPath): MemoraCategory? =
        categories.values.firstOrNull { it.path == path }

    override fun delete(id: String) {
        categories.remove(id)
    }
}
