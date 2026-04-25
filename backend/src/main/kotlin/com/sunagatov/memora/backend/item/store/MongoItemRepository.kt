package com.sunagatov.memora.backend.item.store

import com.sunagatov.memora.backend.item.model.ItemStatus
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface MongoItemRepository : MongoRepository<MongoItemDocument, String> {

    fun findByStatusIn(statuses: Collection<ItemStatus>): List<MongoItemDocument>

    @Query("{ 'categoryPath.category': ?0, 'categoryPath.subcategory': ?1 }")
    fun findByCategoryPathFields(
        category: String,
        subcategory: String
    ): List<MongoItemDocument>

    @Query(
        value = "{ 'categoryPath.category': ?0, 'categoryPath.subcategory': ?1 }",
        count = true
    )
    fun countByCategoryPathFields(
        category: String,
        subcategory: String
    ): Long
}
