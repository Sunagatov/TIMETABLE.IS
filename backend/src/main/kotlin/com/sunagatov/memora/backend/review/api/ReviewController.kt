package com.sunagatov.memora.backend.review.api

import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.review.application.ReviewService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ReviewController(
    private val reviewService: ReviewService
) {

    @GetMapping("/api/review/needs-review")
    fun getNeedsReview(): List<MemoraItem> = reviewService.getNeedsReview()

    @GetMapping("/api/review/failures")
    fun getFailures(): List<MemoraItem> = reviewService.getFailures()

    @GetMapping("/api/items/approved")
    fun getApproved(): List<MemoraItem> = reviewService.getApproved()

    @PostMapping("/api/review/{itemId}/approve")
    fun approve(@PathVariable itemId: String): MemoraItem =
        reviewService.approve(itemId)

    @PostMapping("/api/review/{itemId}/reject")
    fun reject(@PathVariable itemId: String): MemoraItem =
        reviewService.reject(itemId)

    @DeleteMapping("/api/review/{itemId}")
    fun delete(@PathVariable itemId: String): MemoraItem =
        reviewService.delete(itemId)
}
