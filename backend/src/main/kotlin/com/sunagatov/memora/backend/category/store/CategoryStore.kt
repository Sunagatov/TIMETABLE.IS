package com.sunagatov.memora.backend.category.store

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.category.model.MemoraCategory

interface CategoryStore {
    fun save(category: MemoraCategory): MemoraCategory
    fun findAll(): List<MemoraCategory>
    fun findById(id: String): MemoraCategory?
    fun findByPath(path: CategoryPath): MemoraCategory?
    fun delete(id: String)
}
