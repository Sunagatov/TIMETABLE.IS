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
        require(item.status in ItemStatus.approvedStatuses()) {
            "Only approved items can be edited directly"
        }

        return itemStore.save(buildUpdatedItem(item, request, ItemStatus.HUMAN_EDITED_APPROVED))
    }

    fun editAndApprove(itemId: String, request: UpdateItemRequest): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.reviewableStatuses()) {
            "Only reviewable items can be edited and approved"
        }

        return itemStore.save(buildUpdatedItem(item, request, ItemStatus.HUMAN_EDITED_APPROVED))
    }

    private fun buildUpdatedItem(
        item: MemoraItem,
        request: UpdateItemRequest,
        nextStatus: ItemStatus
    ): MemoraItem {
        val nextCategoryPath = request.categoryPath
            ?.toCategoryPath()
            ?.let(categoryService::requireExistingPath)
            ?: item.categoryPath

        return item.copy(
            rawTranscript = request.rawTranscript?.trim() ?: item.rawTranscript,
            title = request.title?.trim()?.takeIf { it.isNotBlank() } ?: item.title,
            cleanedText = request.cleanedText?.trim()?.takeIf { it.isNotBlank() } ?: item.cleanedText,
            type = request.type ?: item.type,
            categoryPath = nextCategoryPath,
            priority = request.priority ?: item.priority,
            status = nextStatus,
            failureStage = null,
            failureReason = null,
            updatedAt = Instant.now()
        )
    }

    private fun requireItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?: throw IllegalArgumentException("Item not found: $itemId")
}
