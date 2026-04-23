package com.sunagatov.memora.backend.review.application

import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.store.ItemStore
import java.time.Instant
import org.springframework.stereotype.Service

@Service
class ReviewService(
    private val itemStore: ItemStore
) {

    fun getNeedsReview(): List<MemoraItem> =
        itemStore.findByStatuses(setOf(ItemStatus.AI_PROCESSED_UNREVIEWED))

    fun getFailures(): List<MemoraItem> =
        itemStore.findByStatuses(setOf(ItemStatus.TRANSCRIPTION_FAILED, ItemStatus.AI_PROCESSING_FAILED))

    fun getApproved(): List<MemoraItem> =
        itemStore.findByStatuses(setOf(ItemStatus.HUMAN_APPROVED, ItemStatus.HUMAN_EDITED_APPROVED))

    fun approve(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        val next = item.copy(
            status = ItemStatus.HUMAN_APPROVED,
            updatedAt = Instant.now()
        )
        return itemStore.save(next)
    }

    fun reject(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        val next = item.copy(
            status = ItemStatus.REJECTED,
            updatedAt = Instant.now()
        )
        return itemStore.save(next)
    }

    fun delete(itemId: String): MemoraItem {
        val item = requireItem(itemId)
        val next = item.copy(
            status = ItemStatus.DELETED,
            updatedAt = Instant.now()
        )
        return itemStore.save(next)
    }

    private fun requireItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?: throw IllegalArgumentException("Item not found: $itemId")
}
