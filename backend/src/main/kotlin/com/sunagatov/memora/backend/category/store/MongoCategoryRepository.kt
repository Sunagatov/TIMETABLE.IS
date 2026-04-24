package com.sunagatov.memora.backend.category.store

import org.springframework.data.mongodb.repository.MongoRepository

interface MongoCategoryRepository : MongoRepository<MongoCategoryDocument, String> {

    fun findByCategoryAndSubcategoryAndSubsubcategory(
        category: String,
        subcategory: String,
        subsubcategory: String
    ): MongoCategoryDocument?
}
