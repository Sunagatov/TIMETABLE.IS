package com.sunagatov.memora.backend.item.store.mongo

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.model.ItemStatus
import org.springframework.data.mongodb.repository.MongoRepository

interface MongoMemoraItemRepository : MongoRepository<MongoMemoraItemDocument, String> {
    fun findByStatusIn(statuses: Collection<ItemStatus>): List<MongoMemoraItemDocument>
    fun findByCategoryPath(path: CategoryPath): List<MongoMemoraItemDocument>
    fun countByCategoryPath(path: CategoryPath): Long
}
