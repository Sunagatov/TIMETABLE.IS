package com.sunagatov.memora.backend.review.api

import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.review.application.ReviewService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/review")
class ReviewController(
    private val reviewService: ReviewService
) {

    @GetMapping("/needs-review")
    fun getNeedsReview(@ModelAttribute query: ItemListQueryRequest): List<MemoraItem> =
        reviewService.getNeedsReview(query)

    @GetMapping("/failures")
    fun getFailures(@ModelAttribute query: ItemListQueryRequest): List<MemoraItem> =
        reviewService.getFailures(query)

    @PostMapping("/{itemId}/approve")
    fun approve(@PathVariable itemId: String): MemoraItem =
        reviewService.approve(itemId)

    @PostMapping("/{itemId}/edit-and-approve")
    fun editAndApprove(
        @PathVariable itemId: String,
        @Valid @RequestBody request: UpdateItemRequest
    ): MemoraItem = reviewService.editAndApprove(itemId, request)

    @PostMapping("/{itemId}/category-proposal/approve")
    fun approveCategoryProposal(@PathVariable itemId: String): MemoraItem =
        reviewService.approveCategoryProposal(itemId)

    @PostMapping("/{itemId}/category-proposal/reject")
    fun rejectCategoryProposal(@PathVariable itemId: String): MemoraItem =
        reviewService.rejectCategoryProposal(itemId)

    @PostMapping("/{itemId}/reject")
    fun reject(@PathVariable itemId: String): MemoraItem =
        reviewService.reject(itemId)

    @DeleteMapping("/{itemId}/trash")
    fun deleteToTrash(@PathVariable itemId: String): MemoraItem =
        reviewService.deleteToTrash(itemId)

    @PostMapping("/{itemId}/retry")
    fun retry(@PathVariable itemId: String): MemoraItem =
        reviewService.retry(itemId)

    @PostMapping("/{itemId}/regenerate-cleaned-text")
    fun regenerateCleanedText(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateCleanedText(itemId)

    @PostMapping("/{itemId}/regenerate-answer")
    fun regenerateAnswer(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateAnswer(itemId)

    @PostMapping("/{itemId}/regenerate-category-proposal")
    fun regenerateCategoryProposal(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateCategoryProposal(itemId)

    @PostMapping("/{itemId}/regenerate-all")
    fun regenerateAll(@PathVariable itemId: String): MemoraItem =
        reviewService.regenerateAll(itemId)
}
