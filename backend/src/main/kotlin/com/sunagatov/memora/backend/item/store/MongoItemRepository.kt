package com.sunagatov.memora.backend.item.store

import com.sunagatov.memora.backend.item.model.ItemStatus
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface MongoItemRepository : MongoRepository<MongoItemDocument, String> {

    fun findByStatusIn(statuses: Collection<ItemStatus>): List<MongoItemDocument>

    @Query("{ 'categoryPath.category': ?0, 'categoryPath.subcategory': ?1, 'categoryPath.subsubcategory': ?2 }")
    fun findByCategoryPathFields(
        category: String,
        subcategory: String,
        subsubcategory: String
    ): List<MongoItemDocument>

    @Query(
        value = "{ 'categoryPath.category': ?0, 'categoryPath.subcategory': ?1, 'categoryPath.subsubcategory': ?2 }",
        count = true
    )
    fun countByCategoryPathFields(
        category: String,
        subcategory: String,
        subsubcategory: String
    ): Long
}
