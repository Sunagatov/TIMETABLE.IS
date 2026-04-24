package com.sunagatov.memora.backend.item.api

import com.sunagatov.memora.backend.item.application.ItemService
import com.sunagatov.memora.backend.item.model.MemoraItem
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/items")
class ItemController(
    private val itemService: ItemService
) {

    @GetMapping("/approved")
    fun listApproved(): List<MemoraItem> = itemService.listApproved()

    @GetMapping("/{itemId}")
    fun getById(@PathVariable itemId: String): MemoraItem =
        itemService.getById(itemId)

    @PatchMapping("/{itemId}")
    fun updateItem(
        @PathVariable itemId: String,
        @Valid @RequestBody request: UpdateItemRequest
    ): MemoraItem = itemService.updateItem(itemId, request)
}
