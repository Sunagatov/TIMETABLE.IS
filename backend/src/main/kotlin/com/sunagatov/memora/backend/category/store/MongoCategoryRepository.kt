package com.sunagatov.memora.backend.category.store

import org.springframework.data.mongodb.repository.MongoRepository

interface MongoCategoryRepository : MongoRepository<MongoCategoryDocument, String> {

    fun findByCategoryAndSubcategory(
        category: String,
        subcategory: String
    ): MongoCategoryDocument?
}
