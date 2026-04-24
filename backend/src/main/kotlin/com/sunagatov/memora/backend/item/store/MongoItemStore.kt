package com.sunagatov.memora.backend.item.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

@Component
@Profile("mongo")
class MongoItemStore(private val repository: MongoItemRepository) : ItemStore {

    override fun save(item: MemoraItem): MemoraItem {
        repository.save(item.toDocument())
        return item
    }

    override fun findAll(): List<MemoraItem> =
        repository.findAll()
            .map { it.toDomain() }
            .sortedByDescending { it.createdAt }

    override fun findById(id: String): MemoraItem? =
        repository.findById(id).orElse(null)?.toDomain()

    override fun findByStatuses(statuses: Set<ItemStatus>): List<MemoraItem> =
        repository.findByStatusIn(statuses)
            .map { it.toDomain() }
            .sortedByDescending { it.createdAt }

    override fun findByCategoryPath(path: CategoryPath): List<MemoraItem> =
        repository.findByCategoryPathFields(path.category, path.subcategory, path.subsubcategory)
            .map { it.toDomain() }
            .sortedByDescending { it.createdAt }

    override fun countByCategoryPath(path: CategoryPath): Long =
        repository.countByCategoryPathFields(path.category, path.subcategory, path.subsubcategory)
}
