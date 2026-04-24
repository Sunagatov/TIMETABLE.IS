package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
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
        val nextCategoryPath = resolveCategoryPath(item, request.categoryPath?.toCategoryPath())
        val answerUpdate = resolveAnswerUpdate(item, request.answer, request.answerStatus)
        val nextProposalStatus =
            if (item.proposedCategoryPath != null && request.categoryPath != null) {
                when (nextCategoryPath) {
                    item.proposedCategoryPath -> ProposedCategoryStatus.APPROVED
                    else -> ProposedCategoryStatus.REJECTED
                }
            } else {
                item.proposedCategoryStatus
            }

        return item.copy(
            rawTranscript = request.rawTranscript?.trim() ?: item.rawTranscript,
            title = request.title?.trim()?.takeIf { it.isNotBlank() } ?: item.title,
            cleanedText = request.cleanedText?.trim()?.takeIf { it.isNotBlank() } ?: item.cleanedText,
            type = request.type ?: item.type,
            categoryPath = nextCategoryPath,
            priority = request.priority ?: item.priority,
            answer = answerUpdate.answer,
            answerStatus = answerUpdate.answerStatus,
            answerFailureStage = answerUpdate.answerFailureStage,
            answerFailureReason = answerUpdate.answerFailureReason,
            proposedCategoryStatus = nextProposalStatus,
            status = ItemStatus.HUMAN_EDITED_APPROVED,
            failureStage = null,
            failureReason = null,
            updatedAt = Instant.now()
        )
    }

    private fun requireItem(itemId: String): MemoraItem =
        itemStore.findById(itemId)
            ?: throw IllegalArgumentException("Item not found: $itemId")

    private fun resolveCategoryPath(item: MemoraItem, requestedPath: CategoryPath?): CategoryPath =
        when {
            requestedPath == null -> item.categoryPath
            item.proposedCategoryPath != null && requestedPath == item.proposedCategoryPath -> {
                categoryService.ensureReusablePath(requestedPath).path
            }
            else -> categoryService.requireExistingPath(requestedPath)
        }

    private fun resolveAnswerUpdate(
        item: MemoraItem,
        requestedAnswer: String?,
        requestedStatus: AnswerStatus?
    ): AnswerUpdate {
        if (requestedStatus == null && requestedAnswer == null) {
            return AnswerUpdate(
                answer = item.answer,
                answerStatus = item.answerStatus,
                answerFailureStage = item.answerFailureStage,
                answerFailureReason = item.answerFailureReason
            )
        }

        if (requestedStatus == AnswerStatus.FAILED) {
            throw IllegalArgumentException("Answer failure status cannot be set manually")
        }

        return when (requestedStatus) {
            AnswerStatus.NONE -> AnswerUpdate(null, AnswerStatus.NONE, null, null)
            AnswerStatus.REJECTED -> AnswerUpdate(null, AnswerStatus.REJECTED, null, null)
            AnswerStatus.DELETED -> AnswerUpdate(null, AnswerStatus.DELETED, null, null)
            AnswerStatus.GENERATED, AnswerStatus.EDITED -> {
                val answer = requestedAnswer?.trim()?.takeIf { it.isNotBlank() }
                    ?: throw IllegalArgumentException("Answer text must be provided when setting answer status")
                AnswerUpdate(answer, requestedStatus, null, null)
            }
            null -> {
                val answer = requestedAnswer?.trim()?.takeIf { it.isNotBlank() }
                    ?: throw IllegalArgumentException("Answer text must be provided")
                AnswerUpdate(answer, AnswerStatus.EDITED, null, null)
            }
        }
    }

    private data class AnswerUpdate(
        val answer: String?,
        val answerStatus: AnswerStatus,
        val answerFailureStage: com.sunagatov.memora.backend.item.model.FailureStage?,
        val answerFailureReason: String?
    )
}
