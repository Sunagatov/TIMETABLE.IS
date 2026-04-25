package com.sunagatov.memora.backend.category.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.category.model.MemoraCategory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(
    prefix = "memora.storage",
    name = ["mode"],
    havingValue = "mongo",
    matchIfMissing = true
)
class MongoCategoryStore(private val repository: MongoCategoryRepository) : CategoryStore {

    override fun save(category: MemoraCategory): MemoraCategory {
        repository.save(category.toDocument())
        return category
    }

    override fun findAll(): List<MemoraCategory> =
        repository.findAll()
            .map { it.toDomain() }
            .sortedWith(
                compareBy(
                    { it.path.category.lowercase() },
                    { it.path.subcategory.lowercase() }
                )
            )

    override fun findById(id: String): MemoraCategory? =
        repository.findById(id).orElse(null)?.toDomain()

    override fun findByPath(path: CategoryPath): MemoraCategory? =
        repository.findByCategoryAndSubcategory(
            path.category,
            path.subcategory
        )?.toDomain()

    override fun delete(id: String) {
        repository.deleteById(id)
    }
}
