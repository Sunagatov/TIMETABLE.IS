package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.capture.api.TelegramIngestRequest
import com.sunagatov.memora.backend.capture.api.TelegramVoicePayload
import com.sunagatov.memora.backend.capture.application.TelegramCaptureService
import com.sunagatov.memora.backend.capture.application.TelegramFailureNotificationService
import com.sunagatov.memora.backend.capture.store.InMemoryFailureNotificationStore
import com.sunagatov.memora.backend.category.api.CategoryPathRequest
import com.sunagatov.memora.backend.category.api.CreateCategoryRequest
import com.sunagatov.memora.backend.category.api.RenameCategoryRequest
import com.sunagatov.memora.backend.category.application.CategoryService
import com.sunagatov.memora.backend.category.store.InMemoryCategoryStore
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.api.EditAndApproveRequest
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.item.application.ItemService
import com.sunagatov.memora.backend.item.application.ItemProcessingService
import com.sunagatov.memora.backend.item.application.ItemQueryService
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.store.InMemoryItemStore
import com.sunagatov.memora.backend.review.application.ReviewService
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import java.util.concurrent.AbstractExecutorService
import java.util.concurrent.TimeUnit
import java.util.concurrent.ExecutorService

class FoundationServicesTests {

    @Test
    fun `text ingest lands in needs review with default category`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val service = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        val item = service.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-1",
                text = "remember to review kotlin contracts"
            )
        )

        val stored = itemStore.findById(item.id)!!

        assertEquals(ItemStatus.RECEIVED, item.status)
        assertEquals(ItemStatus.AI_PROCESSED_UNREVIEWED, stored.status)
        assertEquals("Default", stored.categoryPath.category)
        assertEquals("General", stored.categoryPath.subcategory)
        assertEquals("Inbox", stored.categoryPath.subsubcategory)
        assertEquals("Remember to review kotlin contracts", stored.cleanedText)
    }

    @Test
    fun `voice ingest is kept visible as retryable transcription failure`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val service = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

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

        val stored = itemStore.findById(item.id)!!

        assertEquals(ItemStatus.RECEIVED, item.status)
        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, stored.status)
        assertEquals(FailureStage.TRANSCRIPTION, stored.failureStage)
        assertEquals("file-1", stored.telegramTrace?.telegramFileId)
        assertEquals("audio/ogg", stored.telegramTrace?.mimeType)
    }

    @Test
    fun `renaming a category updates linked items and approved edits stay approved`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = ReviewService(itemStore, itemService, processingService, ItemQueryService())

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

        val approved = reviewService.editAndApprove(
            ingested.id,
            EditAndApproveRequest(
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

    @Test
    fun `approved query supports keyword status and sort filters`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = ReviewService(itemStore, itemService, processingService, ItemQueryService())

        val first = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-5",
                text = "alpha note first"
            )
        )
        reviewService.approve(first.id)

        val second = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-6",
                text = "zulu note second"
            )
        )
        reviewService.approve(second.id)

        val filtered = itemService.listApproved(
            ItemListQueryRequest(
                keyword = "zulu",
                status = ItemStatus.HUMAN_APPROVED,
                sort = "title-desc"
            )
        )

        assertEquals(1, filtered.size)
        assertEquals(second.id, filtered.single().id)

        val sorted = itemService.listApproved(ItemListQueryRequest(sort = "title-asc"))
        assertEquals(first.id, sorted.first().id)
        assertEquals(second.id, sorted.last().id)
    }

    @Test
    fun `failed telegram items are exposed once through failure notifications until acknowledged`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val notificationService = TelegramFailureNotificationService(
            itemStore = itemStore,
            notificationStore = InMemoryFailureNotificationStore(),
            properties = testProperties()
        )

        val failed = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "123456",
                telegramMessageId = "msg-4",
                voice = TelegramVoicePayload(
                    fileId = "file-2",
                    fileUniqueId = "unique-2"
                )
            )
        )

        val notifications = notificationService.listPending()
        assertEquals(1, notifications.size)
        assertEquals(failed.id, notifications.single().memoraId)
        assertEquals("transcriptionRetries=0/3, aiRetries=0/2", notifications.single().retryContext)

        notificationService.markDelivered(notifications.single().notificationId)

        assertEquals(0, notificationService.listPending().size)
    }

    // T1: owner-only Telegram acceptance (FR-01)
    @Test
    fun `ingest rejects messages from non-owner telegram user`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val service = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        assertFailsWith<IllegalArgumentException> {
            service.ingest(
                TelegramIngestRequest(
                    telegramUserId = "not-the-owner",
                    telegramChatId = "chat-1",
                    telegramMessageId = "msg-10",
                    text = "this should be rejected"
                )
            )
        }

        assertEquals(0, itemStore.findAll().size)
    }

    // T2: exactly one of text or voice required (FR-02)
    @Test
    fun `ingest request rejects both text and voice present`() {
        assertFailsWith<IllegalArgumentException> {
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-11",
                text = "some text",
                voice = TelegramVoicePayload(fileId = "f", fileUniqueId = "u")
            )
        }
    }

    @Test
    fun `ingest request rejects neither text nor voice present`() {
        assertFailsWith<IllegalArgumentException> {
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-12"
            )
        }
    }

    // T3: direct PATCH is approved-only
    @Test
    fun `direct item patch rejected for non-approved item`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())

        val ingested = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-13",
                text = "needs review item"
            )
        )

        // Item is in AI_PROCESSED_UNREVIEWED — direct patch must be rejected
        assertFailsWith<IllegalArgumentException> {
            itemService.updateItem(ingested.id, UpdateItemRequest(title = "Changed"))
        }
    }

    // T4: edit-and-approve only works on reviewable items
    @Test
    fun `edit-and-approve rejected for already approved item`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = ReviewService(itemStore, itemService, processingService, ItemQueryService())

        val ingested = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-14",
                text = "already approved item"
            )
        )
        reviewService.approve(ingested.id)

        // Already approved — edit-and-approve must be rejected
        assertFailsWith<IllegalArgumentException> {
            reviewService.editAndApprove(ingested.id, EditAndApproveRequest(title = "Cannot re-approve"))
        }
    }

    // T5: retry is only allowed on failed items
    @Test
    fun `retry rejected for reviewable item`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = ReviewService(itemStore, itemService, processingService, ItemQueryService())

        val ingested = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-15",
                text = "reviewable item"
            )
        )

        // Item is in AI_PROCESSED_UNREVIEWED — retry must be rejected
        assertFailsWith<IllegalArgumentException> {
            reviewService.retry(ingested.id)
        }
    }

    // T6: category delete blocked when non-empty
    @Test
    fun `category delete blocked when category path is still used by an item`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = ReviewService(itemStore, itemService, processingService, ItemQueryService())

        val customCategory = categoryService.create(
            CreateCategoryRequest(
                path = CategoryPathRequest(
                    category = "Work",
                    subcategory = "Ops",
                    subsubcategory = "Infra"
                )
            )
        )

        val ingested = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-16",
                text = "idea about infra"
            )
        )
        reviewService.editAndApprove(
            ingested.id,
            EditAndApproveRequest(categoryPath = CategoryPathRequest("Work", "Ops", "Infra"))
        )

        assertFailsWith<IllegalArgumentException> {
            categoryService.delete(customCategory.id)
        }
    }

    private fun createCategoryService(itemStore: InMemoryItemStore): CategoryService =
        CategoryService(
            categoryStore = InMemoryCategoryStore(),
            itemStore = itemStore,
            properties = testProperties()
        )

    private fun createProcessingService(
        itemStore: InMemoryItemStore,
        categoryService: CategoryService
    ): ItemProcessingService =
        ItemProcessingService(
            itemStore = itemStore,
            categoryService = categoryService,
            properties = testProperties(),
            executor = directExecutor()
        )

    private fun directExecutor(): ExecutorService =
        object : AbstractExecutorService() {
            private var shutdown = false

            override fun shutdown() {
                shutdown = true
            }

            override fun shutdownNow(): MutableList<Runnable> {
                shutdown = true
                return mutableListOf()
            }

            override fun isShutdown(): Boolean = shutdown

            override fun isTerminated(): Boolean = shutdown

            override fun awaitTermination(timeout: Long, unit: TimeUnit): Boolean = true

            override fun execute(command: Runnable) {
                command.run()
            }
        }

    private fun testProperties(): MemoraProperties =
        MemoraProperties(
            allowedOrigin = "http://localhost:5173",
            appPasswordHash = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
            sessionDays = 30,
            botIngestToken = "bot-token",
            defaultCategoryPath = "Default/General/Inbox",
            ownerTelegramUserId = "owner-1",
            transcriptionAutoRetryAttempts = 3,
            aiAutoRetryAttempts = 2
        )
}
