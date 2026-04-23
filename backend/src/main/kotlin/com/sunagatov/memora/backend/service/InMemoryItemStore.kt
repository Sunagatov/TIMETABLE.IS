package com.sunagatov.memora.backend.service

import com.sunagatov.memora.backend.domain.ItemStatus
import com.sunagatov.memora.backend.domain.MemoraItem
import java.util.concurrent.ConcurrentHashMap
import org.springframework.stereotype.Component

@Component
class InMemoryItemStore : ItemStore {

    private val items = ConcurrentHashMap<String, MemoraItem>()

    override fun save(item: MemoraItem): MemoraItem {
        items[item.id] = item
        return item
    }

    override fun findById(id: String): MemoraItem? = items[id]

    override fun findByStatuses(statuses: Set<ItemStatus>): List<MemoraItem> =
        items.values
            .filter { it.status in statuses }
            .sortedByDescending { it.createdAt }
}
