package com.sunagatov.memora.backend.item.store

import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem

interface ItemStore {
    fun save(item: MemoraItem): MemoraItem
    fun findById(id: String): MemoraItem?
    fun findByStatuses(statuses: Set<ItemStatus>): List<MemoraItem>
}
