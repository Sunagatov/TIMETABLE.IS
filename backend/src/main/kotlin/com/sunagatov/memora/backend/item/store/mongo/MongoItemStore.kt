package com.sunagatov.memora.backend.item.store.mongo

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.store.ItemStore
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora", name = ["storage"], havingValue = "mongo", matchIfMissing = true)
class MongoItemStore(
    private val repository: MongoMemoraItemRepository
) : ItemStore {

    override fun save(item: MemoraItem): MemoraItem =
        repository.save(item.toDocument()).toDomain()

    override fun findAll(): List<MemoraItem> =
        repository.findAll()
            .map { it.toDomain() }
            .sortedByDescending { it.createdAt }

    override fun findById(id: String): MemoraItem? =
        repository.findById(id)
            .orElse(null)
            ?.toDomain()

    override fun findByStatuses(statuses: Set<ItemStatus>): List<MemoraItem> =
        repository.findByStatusIn(statuses)
            .map { it.toDomain() }
            .sortedByDescending { it.createdAt }

    override fun findByCategoryPath(path: CategoryPath): List<MemoraItem> =
        repository.findByCategoryPath(path)
            .map { it.toDomain() }
            .sortedByDescending { it.createdAt }

    override fun countByCategoryPath(path: CategoryPath): Long =
        repository.countByCategoryPath(path)
}
