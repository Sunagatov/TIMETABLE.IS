package com.sunagatov.memora.backend.item.application

import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.MemoraItem
import java.time.LocalDate
import java.time.ZoneOffset
import org.springframework.stereotype.Service

@Service
class ItemQueryService {

    fun query(
        items: List<MemoraItem>,
        request: ItemListQueryRequest,
        allowedStatuses: Set<ItemStatus>
    ): List<MemoraItem> {
        val filtered = items
            .asSequence()
            .filter { it.status in allowedStatuses }
            .filter { matchesKeyword(it, request.keyword) }
            .filter { request.type?.let { type -> it.type == type } ?: true }
            .filter { request.status?.let { status -> it.status == status } ?: true }
            .filter { request.priority?.let { priority -> it.priority == priority } ?: true }
            .filter { matchesCategoryPath(it.categoryPath, request.category, request.subcategory) }
            .filter { matchesCreatedFrom(it, request.createdFrom) }
            .filter { matchesCreatedTo(it, request.createdTo) }
            .toList()

        return sort(filtered, request.sort)
    }

    private fun matchesKeyword(item: MemoraItem, keyword: String?): Boolean {
        val term = keyword?.trim()?.takeIf { it.isNotBlank() }?.lowercase() ?: return true
        val haystack = buildString {
            append(item.title)
            append(' ')
            append(item.cleanedText)
            append(' ')
            append(item.rawTranscript.orEmpty())
            append(' ')
            append(item.rawInputText.orEmpty())
            append(' ')
            append(item.answer.orEmpty())
        }.lowercase()

        return haystack.contains(term)
    }

    private fun matchesCategoryPath(path: CategoryPath, category: String?, subcategory: String?): Boolean {
        val cat = category?.trim()?.takeIf { it.isNotBlank() }
        val sub = subcategory?.trim()?.takeIf { it.isNotBlank() }
        return (cat == null || path.category == cat) && (sub == null || path.subcategory == sub)
    }

    private fun matchesCreatedFrom(item: MemoraItem, createdFrom: LocalDate?): Boolean {
        val from = createdFrom ?: return true
        val start = from.atStartOfDay().toInstant(ZoneOffset.UTC)
        return !item.createdAt.isBefore(start)
    }

    private fun matchesCreatedTo(item: MemoraItem, createdTo: LocalDate?): Boolean {
        val to = createdTo ?: return true
        val end = to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC)
        return item.createdAt.isBefore(end)
    }

    private fun sort(items: List<MemoraItem>, sort: String?): List<MemoraItem> {
        val requestedSort = parseSort(sort)

        val comparator = when (requestedSort.field) {
            SortField.CREATED_AT -> compareBy<MemoraItem> { it.createdAt }
            SortField.TITLE -> compareBy<MemoraItem> { it.title.lowercase() }
            SortField.CATEGORY -> compareBy<MemoraItem> { "${it.categoryPath.category}/${it.categoryPath.subcategory}".lowercase() }
        }.thenBy { it.id }

        return if (requestedSort.direction == SortDirection.ASC) {
            items.sortedWith(comparator)
        } else {
            items.sortedWith(comparator.reversed())
        }
    }

    private fun parseSort(sort: String?): SortRequest {
        val value = sort?.trim().takeIf { !it.isNullOrBlank() } ?: DEFAULT_SORT
        val parts = value.split("-")
        require(parts.size == 2) { "Invalid sort value: $value" }

        val field = when (parts[0]) {
            "createdAt" -> SortField.CREATED_AT
            "title" -> SortField.TITLE
            "category" -> SortField.CATEGORY
            else -> throw IllegalArgumentException("Unsupported sort field: ${parts[0]}")
        }

        val direction = when (parts[1]) {
            "asc" -> SortDirection.ASC
            "desc" -> SortDirection.DESC
            else -> throw IllegalArgumentException("Unsupported sort direction: ${parts[1]}")
        }

        return SortRequest(field, direction)
    }

    private data class SortRequest(
        val field: SortField,
        val direction: SortDirection
    )

    private enum class SortField {
        CREATED_AT,
        TITLE,
        CATEGORY
    }

    private enum class SortDirection {
        ASC,
        DESC
    }

    private companion object {
        const val DEFAULT_SORT = "createdAt-desc"
    }
}
