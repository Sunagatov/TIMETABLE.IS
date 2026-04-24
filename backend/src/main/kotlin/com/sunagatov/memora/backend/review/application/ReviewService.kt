package com.sunagatov.memora.backend.review.application

import com.sunagatov.memora.backend.item.api.EditAndApproveRequest
import com.sunagatov.memora.backend.item.application.ItemService
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import org.springframework.stereotype.Service

@Service
class ReviewService(
    private val itemStore: ItemStore,
    private val itemService: ItemService
) {

    fun getNeedsReview(): List<MemoraItem> =
        itemStore.findByStatuses(ItemStatus.reviewableStatuses())

    fun getFailures(): List<MemoraItem> =
        itemStore.findByStatuses(ItemStatus.failureStatuses())

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

    fun editAndApprove(itemId: String, request: EditAndApproveRequest): MemoraItem =
        itemService.editAndApprove(itemId, request.toUpdateItemRequest())

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
                failureReason = "Retry requested, but transcription is not implemented in the backend foundation yet",
                updatedAt = Instant.now()
            )

            FailureStage.AI_PROCESSING -> item.copy(
                retryCountAi = item.retryCountAi + 1,
                status = ItemStatus.AI_PROCESSED_UNREVIEWED,
                failureStage = null,
                failureReason = null,
                updatedAt = Instant.now()
            )

            else -> item.copy(
                updatedAt = Instant.now()
            )
        }

        return itemStore.save(next)
    }

    private fun requireItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?: throw IllegalArgumentException("Item not found: $itemId")
}
