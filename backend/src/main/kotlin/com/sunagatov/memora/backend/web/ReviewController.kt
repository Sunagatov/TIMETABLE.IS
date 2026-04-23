package com.sunagatov.memora.backend.web

import com.sunagatov.memora.backend.service.ItemService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class ReviewController(
    private val itemService: ItemService
) {

    @GetMapping("/review/needs-review")
    fun needsReview() = itemService.getNeedsReview()

    @GetMapping("/review/failures")
    fun failures() = itemService.getFailures()

    @GetMapping("/items/approved")
    fun approved() = itemService.getApproved()
}
