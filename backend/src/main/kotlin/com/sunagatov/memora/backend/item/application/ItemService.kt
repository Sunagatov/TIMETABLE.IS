package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import org.springframework.stereotype.Service

@Service
class ItemService(
    private val itemStore: ItemStore,
    private val categoryService: CategoryService,
    private val itemQueryService: ItemQueryService
) {

    fun listApproved(query: ItemListQueryRequest = ItemListQueryRequest()): List<MemoraItem> =
        itemQueryService.query(
            items = itemStore.findAll(),
            request = query,
            allowedStatuses = ItemStatus.approvedStatuses()
        )

    fun getById(itemId: String): MemoraItem = requireItem(itemId)

    fun updateItem(itemId: String, request: UpdateItemRequest): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.approvedStatuses()) {
            "Only approved items can be edited directly"
        }

        return itemStore.save(buildUpdatedItem(item, request))
    }

    fun editAndApprove(itemId: String, request: UpdateItemRequest): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.reviewableStatuses()) {
            "Only reviewable items can be edited and approved"
        }

        return itemStore.save(buildUpdatedItem(item, request))
    }

    private fun buildUpdatedItem(item: MemoraItem, request: UpdateItemRequest): MemoraItem {
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
            answer = request.answer?.trim()?.takeIf { it.isNotBlank() } ?: item.answer,
            status = ItemStatus.HUMAN_EDITED_APPROVED,
            failureStage = null,
            failureReason = null,
            updatedAt = Instant.now()
        )
    }

    private fun requireItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?: throw IllegalArgumentException("Item not found: $itemId")
}
