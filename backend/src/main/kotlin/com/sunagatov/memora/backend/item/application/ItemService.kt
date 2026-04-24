package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import org.springframework.stereotype.Service

@Service
class ItemService(
    private val itemStore: ItemStore,
    private val categoryService: CategoryService
) {

    fun listApproved(): List<MemoraItem> =
        itemStore.findByStatuses(ItemStatus.approvedStatuses())

    fun getById(itemId: String): MemoraItem = requireItem(itemId)

    fun updateItem(itemId: String, request: UpdateItemRequest): MemoraItem {
        val item = requireItem(itemId)
        val nextCategoryPath = request.categoryPath
            ?.toCategoryPath()
            ?.let(categoryService::requireExistingPath)
            ?: item.categoryPath

        val next = item.copy(
            rawTranscript = request.rawTranscript?.trim() ?: item.rawTranscript,
            title = request.title?.trim()?.takeIf { it.isNotBlank() } ?: item.title,
            cleanedText = request.cleanedText?.trim()?.takeIf { it.isNotBlank() } ?: item.cleanedText,
            type = request.type ?: item.type,
            categoryPath = nextCategoryPath,
            priority = request.priority ?: item.priority,
            status = resolveStatus(item.status),
            failureStage = null,
            failureReason = null,
            updatedAt = Instant.now()
        )

        return itemStore.save(next)
    }

    private fun resolveStatus(current: ItemStatus): ItemStatus =
        when {
            current in ItemStatus.approvedStatuses() -> ItemStatus.HUMAN_EDITED_APPROVED
            current in ItemStatus.reviewableStatuses() -> ItemStatus.HUMAN_EDITED_APPROVED
            else -> current
        }

    private fun requireItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?: throw IllegalArgumentException("Item not found: $itemId")
}
