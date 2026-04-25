package com.sunagatov.memora.backend.review.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.item.application.ItemService
import com.sunagatov.memora.backend.item.application.ItemProcessingService
import com.sunagatov.memora.backend.item.application.ItemQueryService
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import org.springframework.stereotype.Service

@Service
class ReviewService(
    private val itemStore: ItemStore,
    private val itemService: ItemService,
    private val itemProcessingService: ItemProcessingService,
    private val itemQueryService: ItemQueryService,
    private val categoryService: CategoryService
) {

    fun getNeedsReview(query: ItemListQueryRequest = ItemListQueryRequest()): List<MemoraItem> =
        itemQueryService.query(
            items = itemStore.findAll(),
            request = query,
            allowedStatuses = ItemStatus.reviewableStatuses()
        )

    fun getFailures(query: ItemListQueryRequest = ItemListQueryRequest()): List<MemoraItem> =
        itemQueryService.query(
            items = itemStore.findAll(),
            request = query,
            allowedStatuses = ItemStatus.failureStatuses()
        )

    fun approve(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.reviewableStatuses()) { "Only reviewable items can be approved" }
        val next = item.copy(
            status = ItemStatus.HUMAN_APPROVED,
            failureStage = null,
            failureReason = null,
            updatedAt = Instant.now()
        )
        return itemStore.save(next)
    }

    fun editAndApprove(itemId: String, request: UpdateItemRequest): MemoraItem =
        itemService.editAndApprove(itemId, request)

    fun approveCategoryProposal(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.reviewableStatuses()) {
            "Only reviewable items can approve category proposals"
        }
        val proposedCategoryPath = item.proposedCategoryPath
            ?: throw IllegalArgumentException("Item does not have a proposed category path")

        categoryService.ensureReusablePath(proposedCategoryPath)
        return itemStore.save(
            item.copy(
                categoryPath = proposedCategoryPath,
                proposedCategoryStatus = ProposedCategoryStatus.APPROVED,
                updatedAt = Instant.now()
            )
        )
    }

    fun rejectCategoryProposal(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.reviewableStatuses()) {
            "Only reviewable items can reject category proposals"
        }
        require(item.proposedCategoryPath != null) { "Item does not have a proposed category path" }
        return itemStore.save(
            item.copy(
                proposedCategoryStatus = ProposedCategoryStatus.REJECTED,
                updatedAt = Instant.now()
            )
        )
    }

    fun reject(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.reviewableStatuses()) { "Only reviewable items can be rejected" }
        val next = item.copy(
            status = ItemStatus.REJECTED,
            updatedAt = Instant.now()
        )
        return itemStore.save(next)
    }

    fun deleteToTrash(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        val next = item.copy(
            status = ItemStatus.DELETED,
            updatedAt = Instant.now()
        )
        return itemStore.save(next)
    }

    fun retry(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        require(item.status in ItemStatus.failureStatuses()) { "Only failed items can be retried" }

        val next = when (item.failureStage) {
            FailureStage.TRANSCRIPTION -> item.copy(
                retryCountTranscription = item.retryCountTranscription + 1,
                status = ItemStatus.RECEIVED,
                failureStage = null,
                failureReason = null,
                updatedAt = Instant.now()
            )

            FailureStage.AI_PROCESSING -> item.copy(
                retryCountAi = item.retryCountAi + 1,
                status = ItemStatus.RECEIVED,
                failureStage = null,
                failureReason = null,
                updatedAt = Instant.now()
            )

            else -> item.copy(
                updatedAt = Instant.now()
            )
        }

        val saved = itemStore.save(next)
        itemProcessingService.retry(saved.id)
        return saved
    }

    fun regenerateCleanedText(itemId: String): MemoraItem =
        itemProcessingService.regenerateCleanedText(itemId)

    fun regenerateAnswer(itemId: String): MemoraItem =
        itemProcessingService.regenerateAnswer(itemId)

    fun regenerateCategoryProposal(itemId: String): MemoraItem =
        itemProcessingService.regenerateCategoryProposal(itemId)

    fun regenerateAll(itemId: String): MemoraItem =
        itemProcessingService.regenerateAll(itemId)

    private fun requireItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?: throw IllegalArgumentException("Item not found: $itemId")
}
