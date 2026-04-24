package com.sunagatov.memora.backend.review.api

import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.api.EditAndApproveRequest
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.review.application.ReviewService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.RestController

@RestController
class ReviewController(
    private val reviewService: ReviewService
) {

    @GetMapping("/api/review/needs-review")
    fun getNeedsReview(@ModelAttribute query: ItemListQueryRequest): List<MemoraItem> =
        reviewService.getNeedsReview(query)

    @GetMapping("/api/review/failures")
    fun getFailures(@ModelAttribute query: ItemListQueryRequest): List<MemoraItem> =
        reviewService.getFailures(query)

    @PostMapping("/api/review/{itemId}/approve")
    fun approve(@PathVariable itemId: String): MemoraItem =
        reviewService.approve(itemId)

    @PostMapping("/api/review/{itemId}/edit-and-approve")
    fun editAndApprove(
        @PathVariable itemId: String,
        @Valid @RequestBody request: EditAndApproveRequest
    ): MemoraItem = reviewService.editAndApprove(itemId, request)

    @PostMapping("/api/review/{itemId}/category-proposal/approve")
    fun approveCategoryProposal(@PathVariable itemId: String): MemoraItem =
        reviewService.approveCategoryProposal(itemId)

    @PostMapping("/api/review/{itemId}/category-proposal/reject")
    fun rejectCategoryProposal(@PathVariable itemId: String): MemoraItem =
        reviewService.rejectCategoryProposal(itemId)

    @PostMapping("/api/review/{itemId}/reject")
    fun reject(@PathVariable itemId: String): MemoraItem =
        reviewService.reject(itemId)

    @DeleteMapping("/api/review/{itemId}/trash")
    fun deleteToTrash(@PathVariable itemId: String): MemoraItem =
        reviewService.deleteToTrash(itemId)

    @PostMapping("/api/review/{itemId}/retry")
    fun retry(@PathVariable itemId: String): MemoraItem =
        reviewService.retry(itemId)

    @PostMapping("/api/review/{itemId}/regenerate-cleaned-text")
    fun regenerateCleanedText(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateCleanedText(itemId)

    @PostMapping("/api/review/{itemId}/regenerate-answer")
    fun regenerateAnswer(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateAnswer(itemId)

    @PostMapping("/api/review/{itemId}/regenerate-category-proposal")
    fun regenerateCategoryProposal(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateCategoryProposal(itemId)

    @PostMapping("/api/review/{itemId}/regenerate-all")
    fun regenerateAll(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateAll(itemId)
}
