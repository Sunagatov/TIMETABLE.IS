package com.sunagatov.memora.backend.item.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem

interface ItemStore {
    fun save(item: MemoraItem): MemoraItem
    fun findAll(): List<MemoraItem>
    fun findById(id: String): MemoraItem?
    fun findByStatuses(statuses: Set<ItemStatus>): List<MemoraItem>
    fun findByCategoryPath(path: CategoryPath): List<MemoraItem>
    fun countByCategoryPath(path: CategoryPath): Long
}
