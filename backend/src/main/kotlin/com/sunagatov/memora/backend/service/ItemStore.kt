package com.sunagatov.memora.backend.service

import com.sunagatov.memora.backend.domain.ItemStatus
import com.sunagatov.memora.backend.domain.MemoraItem

interface ItemStore {
    fun save(item: MemoraItem): MemoraItem
    fun findById(id: String): MemoraItem?
    fun findByStatuses(statuses: Set<ItemStatus>): List<MemoraItem>
}
