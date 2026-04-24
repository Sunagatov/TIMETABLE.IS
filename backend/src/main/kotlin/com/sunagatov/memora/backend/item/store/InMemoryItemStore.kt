package com.sunagatov.memora.backend.item.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import java.util.concurrent.ConcurrentHashMap
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora.storage", name = ["mode"], havingValue = "in-memory")
class InMemoryItemStore : ItemStore {

    private val items = ConcurrentHashMap<String, MemoraItem>()

    override fun save(item: MemoraItem): MemoraItem {
        items[item.id] = item
        return item
    }

    override fun findAll(): List<MemoraItem> =
        items.values.sortedByDescending { it.createdAt }

    override fun findById(id: String): MemoraItem? = items[id]

    override fun findByStatuses(statuses: Set<ItemStatus>): List<MemoraItem> =
        items.values
            .filter { it.status in statuses }
            .sortedByDescending { it.createdAt }

    override fun findByCategoryPath(path: CategoryPath): List<MemoraItem> =
        items.values
            .filter { it.categoryPath == path }
            .sortedByDescending { it.createdAt }

    override fun countByCategoryPath(path: CategoryPath): Long =
        items.values.count { it.categoryPath == path }.toLong()
}
