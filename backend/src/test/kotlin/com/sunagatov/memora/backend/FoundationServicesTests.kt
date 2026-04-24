package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.category.api.CreateCategoryRequest
import com.sunagatov.memora.backend.category.api.RenameCategoryRequest
import com.sunagatov.memora.backend.category.api.CategoryPathRequest
import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.category.store.InMemoryCategoryStore
import com.sunagatov.memora.backend.capture.api.TelegramIngestRequest
import com.sunagatov.memora.backend.capture.api.TelegramVoicePayload
import com.sunagatov.memora.backend.capture.application.TelegramCaptureService
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.item.application.ItemService
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.store.InMemoryItemStore
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class FoundationServicesTests {

    @Test
    fun `text ingest lands in needs review with default category`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val service = TelegramCaptureService(itemStore, categoryService, testProperties())

        val item = service.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-1",
                text = "remember to review kotlin contracts"
            )
        )

        assertEquals(ItemStatus.AI_PROCESSED_UNREVIEWED, item.status)
        assertEquals("Default", item.categoryPath.category)
        assertEquals("General", item.categoryPath.subcategory)
        assertEquals("Inbox", item.categoryPath.subsubcategory)
        assertEquals("Remember to review kotlin contracts", item.cleanedText)
    }

    @Test
    fun `voice ingest is kept visible as retryable transcription failure`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val service = TelegramCaptureService(itemStore, categoryService, testProperties())

        val item = service.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-2",
                voice = TelegramVoicePayload(
                    fileId = "file-1",
                    fileUniqueId = "unique-1",
                    durationSeconds = 14,
                    mimeType = "audio/ogg"
                )
            )
        )

        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, item.status)
        assertEquals(FailureStage.TRANSCRIPTION, item.failureStage)
        assertEquals("file-1", item.telegramTrace?.telegramFileId)
        assertEquals("audio/ogg", item.telegramTrace?.mimeType)
    }

    @Test
    fun `renaming a category updates linked items and approved edits stay approved`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val captureService = TelegramCaptureService(itemStore, categoryService, testProperties())
        val itemService = ItemService(itemStore, categoryService)

        val customCategory = categoryService.create(
            CreateCategoryRequest(
                path = CategoryPathRequest(
                    category = "Work",
                    subcategory = "Backend",
                    subsubcategory = "Memora"
                )
            )
        )

        val ingested = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-3",
                text = "idea build approval flow"
            )
        )

        val approved = itemService.updateItem(
            ingested.id,
            UpdateItemRequest(
                categoryPath = CategoryPathRequest("Work", "Backend", "Memora")
            )
        )

        assertEquals(ItemStatus.HUMAN_EDITED_APPROVED, approved.status)

        val renamedCategory = categoryService.rename(
            customCategory.id,
            RenameCategoryRequest(
                path = CategoryPathRequest(
                    category = "Work",
                    subcategory = "Backend",
                    subsubcategory = "Foundation"
                )
            )
        )

        val updated = itemService.getById(ingested.id)

        assertEquals("Foundation", renamedCategory.path.subsubcategory)
        assertEquals("Foundation", updated.categoryPath.subsubcategory)
        assertEquals(ItemStatus.HUMAN_EDITED_APPROVED, updated.status)
        assertNotNull(updated.updatedAt)
    }

    private fun createCategoryService(itemStore: InMemoryItemStore): CategoryService =
        CategoryService(
            categoryStore = InMemoryCategoryStore(),
            itemStore = itemStore,
            properties = testProperties()
        )

    private fun testProperties(): MemoraProperties =
        MemoraProperties(
            allowedOrigin = "http://localhost:5173",
            appPasswordHash = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
            sessionDays = 30,
            botIngestToken = "bot-token",
            defaultCategoryPath = "Default/General/Inbox",
            ownerTelegramUserId = "owner-1"
        )
}
