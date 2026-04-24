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
import com.sunagatov.memora.backend.item.application.ItemService
import com.sunagatov.memora.backend.item.application.ItemProcessingService
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.store.InMemoryItemStore
import com.sunagatov.memora.backend.review.application.ReviewService
import kotlin.test.Test
import kotlin.test.assertEquals
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
        val itemService = ItemService(itemStore, categoryService)
        val reviewService = ReviewService(itemStore, itemService, processingService)

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
            com.sunagatov.memora.backend.item.api.EditAndApproveRequest(
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
    fun `failed telegram items are exposed once through failure notifications until acknowledged`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val notificationService = TelegramFailureNotificationService(
            itemStore = itemStore,
            notificationStore = InMemoryFailureNotificationStore()
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

        notificationService.markDelivered(notifications.single().notificationId)

        assertEquals(0, notificationService.listPending().size)
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
