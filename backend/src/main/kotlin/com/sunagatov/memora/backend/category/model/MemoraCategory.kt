package com.sunagatov.memora.backend.category.model

import java.time.Instant

data class MemoraCategory(
    val id: String,
    val path: CategoryPath,
    val createdAt: Instant,
    val updatedAt: Instant
)
