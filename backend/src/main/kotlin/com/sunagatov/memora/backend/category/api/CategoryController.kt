package com.sunagatov.memora.backend.category.api

import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.category.model.MemoraCategory
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categories")
class CategoryController(
    private val categoryService: CategoryService
) {

    @GetMapping
    fun list(): List<MemoraCategory> = categoryService.list()

    @PostMapping
    fun create(
        @Valid @RequestBody request: CreateCategoryRequest
    ): MemoraCategory = categoryService.create(request)

    @PatchMapping("/{categoryId}")
    fun rename(
        @PathVariable categoryId: String,
        @Valid @RequestBody request: RenameCategoryRequest
    ): MemoraCategory = categoryService.rename(categoryId, request)

    @DeleteMapping("/{categoryId}")
    fun delete(@PathVariable categoryId: String): ResponseEntity<Void> {
        categoryService.delete(categoryId)
        return ResponseEntity.noContent().build()
    }
}
