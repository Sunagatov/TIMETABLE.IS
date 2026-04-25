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
import com.sunagatov.memora.backend.common.api.GlobalExceptionHandler
import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.auth.session.SessionCookieFactory
import com.sunagatov.memora.backend.item.ai.AiAllDraft
import com.sunagatov.memora.backend.item.ai.AiAnswerDraft
import com.sunagatov.memora.backend.item.ai.AiCategoryDraft
import com.sunagatov.memora.backend.item.ai.AiTextDraft
import com.sunagatov.memora.backend.item.ai.AiTextInput
import com.sunagatov.memora.backend.item.api.ItemListQueryRequest
import com.sunagatov.memora.backend.item.api.UpdateItemRequest
import com.sunagatov.memora.backend.item.ai.DeterministicMemoraAiPort
import com.sunagatov.memora.backend.item.ai.MemoraAiPort
import com.sunagatov.memora.backend.item.application.ItemService
import com.sunagatov.memora.backend.item.application.ItemProcessingService
import com.sunagatov.memora.backend.item.application.ItemQueryService
import com.sunagatov.memora.backend.item.model.AnswerStatus
import com.sunagatov.memora.backend.item.model.FailureStage
import com.sunagatov.memora.backend.item.model.ItemStatus
import com.sunagatov.memora.backend.item.model.ItemType
import com.sunagatov.memora.backend.item.model.Priority
import com.sunagatov.memora.backend.item.model.ProposedCategoryStatus
import com.sunagatov.memora.backend.category.model.CategoryPath
import com.sunagatov.memora.backend.item.store.InMemoryItemStore
import com.sunagatov.memora.backend.review.application.ReviewService
import com.sunagatov.memora.backend.transcription.application.DisabledVoiceTranscriptionService
import com.sunagatov.memora.backend.transcription.application.VoiceTranscriptionService
import com.sunagatov.memora.backend.transcription.infrastructure.OpenAiAudioTranscriptionClient
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import java.io.IOException
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
                    mimeType = "audio/ogg",
                    fileSizeBytes = 12345L
                )
            )
        )

        val stored = itemStore.findById(item.id)!!

        assertEquals(ItemStatus.RECEIVED, item.status)
        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, stored.status)
        assertEquals(FailureStage.TRANSCRIPTION, stored.failureStage)
        assertEquals("file-1", stored.telegramTrace?.telegramFileId)
        assertEquals("audio/ogg", stored.telegramTrace?.mimeType)
        assertEquals(12345L, stored.telegramTrace?.fileSizeBytes)
    }

    // V1: successful transcription persists rawTranscript and advances to Needs Review
    @Test
    fun `voice item with successful transcription lands in needs review with raw transcript persisted`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(
            itemStore, categoryService,
            voiceTranscriptionService = VoiceTranscriptionService { _ -> "discuss the reactor pattern in spring" }
        )
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-voice-ok",
                voice = TelegramVoicePayload(fileId = "f-ok", fileUniqueId = "u-ok", mimeType = "audio/ogg")
            )
        )

        val stored = itemStore.findById(item.id)!!
        assertEquals(ItemStatus.AI_PROCESSED_UNREVIEWED, stored.status)
        assertEquals("discuss the reactor pattern in spring", stored.rawTranscript)
        assertNotNull(stored.cleanedText)
        assertNull(stored.failureStage)
        assertNull(stored.failureReason)
    }

    // V2: rawTranscript is included in keyword search (FR-19)
    @Test
    fun `keyword search matches raw transcript of approved voice items`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(
            itemStore, categoryService,
            voiceTranscriptionService = VoiceTranscriptionService { _ -> "discuss the reactor pattern in spring" }
        )
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-voice-search",
                voice = TelegramVoicePayload(fileId = "f-s", fileUniqueId = "u-s")
            )
        )
        reviewService.approve(item.id)

        val results = itemService.listApproved(ItemListQueryRequest(keyword = "reactor"))
        assertEquals(1, results.size)
        assertEquals(item.id, results.single().id)
    }

    // V3: Telegram download failure produces correct failure stage and preserves traceability
    @Test
    fun `telegram download failure produces transcription failed state and preserves trace metadata`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(
            itemStore, categoryService,
            voiceTranscriptionService = VoiceTranscriptionService { _ ->
                throw IllegalStateException("Telegram file download failed with status 403")
            }
        )
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-voice-dl-fail",
                voice = TelegramVoicePayload(fileId = "f-dl-fail", fileUniqueId = "u-dl-fail")
            )
        )

        val stored = itemStore.findById(item.id)!!
        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, stored.status)
        assertEquals(FailureStage.TRANSCRIPTION, stored.failureStage)
        assertTrue(stored.failureReason!!.contains("403"))
        assertEquals("f-dl-fail", stored.telegramTrace?.telegramFileId)
        assertNull(stored.rawTranscript)
    }

    @Test
    fun `io exception during voice processing becomes visible transcription failure`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(
            itemStore, categoryService,
            voiceTranscriptionService = VoiceTranscriptionService { _ ->
                throw IOException("socket closed")
            }
        )
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-voice-io-fail",
                voice = TelegramVoicePayload(fileId = "f-io", fileUniqueId = "u-io")
            )
        )

        val stored = itemStore.findById(item.id)!!
        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, stored.status)
        assertEquals(FailureStage.TRANSCRIPTION, stored.failureStage)
        assertTrue(stored.failureReason!!.contains("socket closed"))
        assertEquals("f-io", stored.telegramTrace?.telegramFileId)
    }

    @Test
    fun `io exception during text ai processing becomes visible ai failure`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val aiPort = object : MemoraAiPort {
            override fun generateTextDraft(input: AiTextInput): AiTextDraft {
                throw IOException("ai connection reset")
            }

            override fun generateCategoryDraft(input: AiTextInput): AiCategoryDraft {
                throw IOException("ai connection reset")
            }

            override fun generateAnswerDraft(cleanedText: String): AiAnswerDraft {
                throw IOException("ai connection reset")
            }

            override fun generateAllDraft(input: AiTextInput): AiAllDraft {
                throw IOException("ai connection reset")
            }
        }
        val processingService = createProcessingService(itemStore, categoryService, aiPort)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-ai-io-fail",
                text = "remember this should fail visibly"
            )
        )

        val stored = itemStore.findById(item.id)!!
        assertEquals(ItemStatus.AI_PROCESSING_FAILED, stored.status)
        assertEquals(FailureStage.AI_PROCESSING, stored.failureStage)
        assertTrue(stored.failureReason!!.contains("ai connection reset"))
    }

    @Test
    fun `unexpected exception handler returns safe api error`() {
        val response = GlobalExceptionHandler().handleUnexpected(RuntimeException("secret stack detail"))

        assertEquals(500, response.statusCode.value())
        assertEquals("Unexpected backend error", response.body!!.message)
    }

    @Test
    fun `transcription response parser accepts plain text and json text`() {
        val client = OpenAiAudioTranscriptionClient(testProperties())

        assertEquals("plain transcript", client.parseTranscript(" plain transcript "))
        assertEquals("json transcript", client.parseTranscript("""{"text":" json transcript "}"""))
    }

    @Test
    fun `session cookie secure flag is configurable`() {
        val secureCookie = SessionCookieFactory(testProperties(cookieSecure = true)).create("session-1")
        val localCookie = SessionCookieFactory(testProperties(cookieSecure = false)).create("session-1")

        assertTrue(secureCookie.toString().contains("Secure"))
        assertTrue(!localCookie.toString().contains("Secure"))
    }

    @Test
    fun `renaming a category updates linked items and approved edits stay approved`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val customCategory = categoryService.create(
            CreateCategoryRequest(
                path = CategoryPathRequest(
                    category = "Work",
                    subcategory = "Backend"
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
            UpdateItemRequest(
                categoryPath = CategoryPathRequest("Work", "Backend")
            )
        )

        assertEquals(ItemStatus.HUMAN_EDITED_APPROVED, approved.status)

        val renamedCategory = categoryService.rename(
            customCategory.id,
            RenameCategoryRequest(
                path = CategoryPathRequest(
                    category = "Work",
                    subcategory = "Foundation"
                )
            )
        )

        val updated = itemService.getById(ingested.id)

        assertEquals("Foundation", renamedCategory.path.subcategory)
        assertEquals("Foundation", updated.categoryPath.subcategory)
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
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

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
        assertEquals(
            "manualTranscriptionRetries=0, manualAiRetries=0, autoTranscriptionAttempts=3, autoAiAttempts=2",
            notifications.single().retryContext
        )

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

    @Test
    fun `ingest rejects when owner telegram user id is not configured`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val service = TelegramCaptureService(
            itemStore,
            categoryService,
            processingService,
            testProperties(ownerTelegramUserId = "")
        )

        assertFailsWith<IllegalArgumentException> {
            service.ingest(
                TelegramIngestRequest(
                    telegramUserId = "owner-1",
                    telegramChatId = "chat-1",
                    telegramMessageId = "msg-no-owner",
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
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

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
            reviewService.editAndApprove(ingested.id, UpdateItemRequest(title = "Cannot re-approve"))
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
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

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
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val customCategory = categoryService.create(
            CreateCategoryRequest(
                path = CategoryPathRequest(
                    category = "Work",
                    subcategory = "Ops"
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
            UpdateItemRequest(categoryPath = CategoryPathRequest("Work", "Ops"))
        )

        assertFailsWith<IllegalArgumentException> {
            categoryService.delete(customCategory.id)
        }
    }

    // T7: retry increments the correct retry counter
    @Test
    fun `retry increments transcription retry counter`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val ingested = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-retry-ctr-1",
                voice = TelegramVoicePayload(fileId = "f-ctr", fileUniqueId = "u-ctr")
            )
        )

        val afterIngest = itemStore.findById(ingested.id)!!
        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, afterIngest.status)
        assertEquals(0, afterIngest.retryCountTranscription)

        reviewService.retry(ingested.id)

        val afterRetry = itemStore.findById(ingested.id)!!
        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, afterRetry.status)
        assertEquals(1, afterRetry.retryCountTranscription)
    }

    // T8: failure notification shows incremented retry counter after retry and re-fail
    @Test
    fun `failure notification shows incremented retry counter after retry and re-fail`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val notificationStore = InMemoryFailureNotificationStore()
        val notificationService = TelegramFailureNotificationService(itemStore, notificationStore, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val ingested = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-redelivery",
                telegramMessageId = "msg-redelivery",
                voice = TelegramVoicePayload(fileId = "f-rd", fileUniqueId = "u-rd")
            )
        )

        val firstPoll = notificationService.listPending()
        assertEquals(1, firstPoll.size)
        assertEquals(
            "manualTranscriptionRetries=0, manualAiRetries=0, autoTranscriptionAttempts=3, autoAiAttempts=2",
            firstPoll.single().retryContext
        )

        // Retry — re-processes and re-fails — retryCountTranscription becomes 1
        reviewService.retry(ingested.id)

        val afterRetry = itemStore.findById(ingested.id)!!
        assertEquals(ItemStatus.TRANSCRIPTION_FAILED, afterRetry.status)
        assertEquals(1, afterRetry.retryCountTranscription)

        // The notificationId may be the same or different depending on timing;
        // what matters is the retry context reflects the incremented counter.
        // Use a fresh notificationStore so we get the current notification regardless.
        val freshNotificationService = TelegramFailureNotificationService(
            itemStore = itemStore,
            notificationStore = InMemoryFailureNotificationStore(),
            properties = testProperties()
        )
        val secondPoll = freshNotificationService.listPending()
        assertEquals(1, secondPoll.size)
        assertEquals(
            "manualTranscriptionRetries=1, manualAiRetries=0, autoTranscriptionAttempts=3, autoAiAttempts=2",
            secondPoll.single().retryContext
        )
    }

    // T9: query filters by category path level
    @Test
    fun `query filters approved items by category path`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        categoryService.create(CreateCategoryRequest(CategoryPathRequest("Work", "Code")))

        val inDefault = captureService.ingest(
            TelegramIngestRequest(telegramUserId = "owner-1", telegramChatId = "chat-1", telegramMessageId = "msg-catflt-1", text = "default inbox item")
        )
        reviewService.approve(inDefault.id)

        val inWork = captureService.ingest(
            TelegramIngestRequest(telegramUserId = "owner-1", telegramChatId = "chat-1", telegramMessageId = "msg-catflt-2", text = "work kotlin item")
        )
        reviewService.editAndApprove(inWork.id, UpdateItemRequest(categoryPath = CategoryPathRequest("Work", "Code")))

        val all = itemService.listApproved()
        assertEquals(2, all.size)

        val workOnly = itemService.listApproved(ItemListQueryRequest(category = "Work"))
        assertEquals(1, workOnly.size)
        assertEquals(inWork.id, workOnly.single().id)

        val defaultOnly = itemService.listApproved(
            ItemListQueryRequest(category = "Default", subcategory = "General")
        )
        assertEquals(1, defaultOnly.size)
        assertEquals(inDefault.id, defaultOnly.single().id)
    }

    // T10: QUESTION type inferred and answer generated for question-like text
    @Test
    fun `question text infers QUESTION type and generates a placeholder answer`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val service = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        val item = service.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-q1",
                text = "What is the capital of France?"
            )
        )

        val stored = itemStore.findById(item.id)!!

        assertEquals(ItemStatus.AI_PROCESSED_UNREVIEWED, stored.status)
        assertEquals(ItemType.QUESTION, stored.type)
        assertEquals(ItemType.QUESTION, stored.aiType)
        assertNotNull(stored.answer)
        assertNotNull(stored.aiAnswer)
        assertEquals(stored.aiAnswer, stored.answer)
    }

    // T11: question detection via question mark suffix
    @Test
    fun `text ending with question mark infers QUESTION type`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val service = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())

        val item = service.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-q2",
                text = "Is Kotlin better than Java?"
            )
        )

        val stored = itemStore.findById(item.id)!!
        assertEquals(ItemType.QUESTION, stored.type)
        assertNotNull(stored.answer)
    }

    // T12: answer is searchable via keyword filter
    @Test
    fun `keyword search matches answer field on QUESTION items`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val question = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-q3",
                text = "What is photosynthesis?"
            )
        )
        reviewService.editAndApprove(
            question.id,
            UpdateItemRequest(answer = "Photosynthesis is the process by which plants convert light into energy.")
        )

        val results = itemService.listApproved(ItemListQueryRequest(keyword = "photosynthesis"))
        assertEquals(1, results.size)
        assertEquals(question.id, results.single().id)
    }

    @Test
    fun `question answer failure stays visible and can be regenerated`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val aiPort = object : MemoraAiPort {
            private val delegate = DeterministicMemoraAiPort()

            override fun generateTextDraft(input: AiTextInput) = delegate.generateTextDraft(input)

            override fun generateCategoryDraft(input: AiTextInput) = delegate.generateCategoryDraft(input)

            override fun generateAnswerDraft(cleanedText: String): AiAnswerDraft =
                AiAnswerDraft(
                    answer = "Recovered answer from regeneration",
                    answerStatus = AnswerStatus.GENERATED
                )

            override fun generateAllDraft(input: AiTextInput): AiAllDraft =
                AiAllDraft(
                    textDraft = delegate.generateTextDraft(input),
                    categoryDraft = delegate.generateCategoryDraft(input),
                    answerDraft = AiAnswerDraft(
                        answer = null,
                        answerStatus = AnswerStatus.FAILED,
                        failureReason = "forced answer failure"
                    )
                )
        }
        val processingService = createProcessingService(itemStore, categoryService, aiPort)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-q4",
                text = "What is answer fail?"
            )
        )

        val stored = itemStore.findById(item.id)!!
        assertEquals(ItemStatus.AI_PROCESSED_UNREVIEWED, stored.status)
        assertEquals(AnswerStatus.FAILED, stored.answerStatus)
        assertEquals("forced answer failure", stored.answerFailureReason)

        reviewService.regenerateAnswer(item.id)

        val regenerated = itemStore.findById(item.id)!!
        assertEquals(AnswerStatus.GENERATED, regenerated.answerStatus)
        assertEquals("Recovered answer from regeneration", regenerated.answer)
        assertEquals(ItemStatus.AI_PROCESSED_UNREVIEWED, regenerated.status)
    }

    @Test
    fun `category proposal can be approved and becomes reusable`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-cat-proposal",
                text = "finance project idea"
            )
        )

        val stored = itemStore.findById(item.id)!!
        assertEquals(ItemStatus.AI_PROCESSED_UNREVIEWED, stored.status)
        assertEquals(AnswerStatus.NONE, stored.answerStatus)
        assertEquals("Default", stored.categoryPath.category)
        assertEquals(ProposedCategoryStatus.PENDING_REVIEW, stored.proposedCategoryStatus)
        assertNotNull(stored.proposedCategoryPath)

        val approved = reviewService.approveCategoryProposal(item.id)
        assertEquals(ProposedCategoryStatus.APPROVED, approved.proposedCategoryStatus)
        assertEquals(approved.proposedCategoryPath, approved.categoryPath)
        assertNotNull(categoryService.list().firstOrNull { it.path == approved.categoryPath })

        val followUp = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-cat-proposal-2",
                text = "finance project idea"
            )
        )

        val followUpStored = itemStore.findById(followUp.id)!!
        assertEquals(approved.categoryPath, followUpStored.categoryPath)
        assertEquals(ProposedCategoryStatus.NONE, followUpStored.proposedCategoryStatus)
    }

    @Test
    fun `category proposal actions are review-only`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-cat-proposal-guard",
                text = "finance project idea"
            )
        )

        reviewService.approve(item.id)

        assertFailsWith<IllegalArgumentException> {
            reviewService.approveCategoryProposal(item.id)
        }
        assertFailsWith<IllegalArgumentException> {
            reviewService.rejectCategoryProposal(item.id)
        }
    }

    @Test
    fun `regenerate all ai output updates current values and preserves original ai output`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val aiPort = object : MemoraAiPort {
            private var calls = 0

            override fun generateTextDraft(input: AiTextInput): AiTextDraft =
                if (calls == 0) {
                    AiTextDraft("First title", "First cleaned", ItemType.THOUGHT, Priority.NOT_APPLICABLE)
                } else {
                    AiTextDraft("Second title", "Second cleaned", ItemType.IDEA, Priority.URGENT_IMPORTANT)
                }

            override fun generateCategoryDraft(input: AiTextInput): AiCategoryDraft =
                if (calls == 0) {
                    AiCategoryDraft(
                        aiCategoryPath = CategoryPath("Default", "General"),
                        proposedCategoryPath = null,
                        proposedCategoryStatus = ProposedCategoryStatus.NONE,
                        currentCategoryPath = CategoryPath("Default", "General")
                    )
                } else {
                    AiCategoryDraft(
                        aiCategoryPath = CategoryPath("Ideas", "Finance"),
                        proposedCategoryPath = CategoryPath("Ideas", "Finance"),
                        proposedCategoryStatus = ProposedCategoryStatus.PENDING_REVIEW,
                        currentCategoryPath = CategoryPath("Default", "General")
                    )
                }

            override fun generateAnswerDraft(cleanedText: String): AiAnswerDraft =
                AiAnswerDraft(answer = null, answerStatus = AnswerStatus.NONE)

            override fun generateAllDraft(input: AiTextInput): AiAllDraft {
                val result = if (calls++ == 0) {
                    AiAllDraft(
                        textDraft = AiTextDraft("First title", "First cleaned", ItemType.THOUGHT, Priority.NOT_APPLICABLE),
                        categoryDraft = AiCategoryDraft(
                            aiCategoryPath = CategoryPath("Default", "General"),
                            proposedCategoryPath = null,
                            proposedCategoryStatus = ProposedCategoryStatus.NONE,
                            currentCategoryPath = CategoryPath("Default", "General")
                        ),
                        answerDraft = AiAnswerDraft(answer = null, answerStatus = AnswerStatus.NONE)
                    )
                } else {
                    AiAllDraft(
                        textDraft = AiTextDraft("Second title", "Second cleaned", ItemType.IDEA, Priority.URGENT_IMPORTANT),
                        categoryDraft = AiCategoryDraft(
                            aiCategoryPath = CategoryPath("Ideas", "Finance"),
                            proposedCategoryPath = CategoryPath("Ideas", "Finance"),
                            proposedCategoryStatus = ProposedCategoryStatus.PENDING_REVIEW,
                            currentCategoryPath = CategoryPath("Default", "General")
                        ),
                        answerDraft = AiAnswerDraft(answer = null, answerStatus = AnswerStatus.NONE)
                    )
                }
                return result
            }
        }
        val processingService = createProcessingService(itemStore, categoryService, aiPort)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-regenerate-all",
                text = "placeholder"
            )
        )

        val original = itemStore.findById(item.id)!!
        assertEquals("First title", original.aiTitle)
        assertEquals("First cleaned", original.aiCleanedText)
        assertEquals("First title", original.title)

        val regenerated = reviewService.regenerateAll(item.id)
        assertEquals("First title", regenerated.aiTitle)
        assertEquals("First cleaned", regenerated.aiCleanedText)
        assertEquals("Second title", regenerated.title)
        assertEquals("Second cleaned", regenerated.cleanedText)
        assertEquals(ItemType.IDEA, regenerated.type)
        assertEquals(Priority.URGENT_IMPORTANT, regenerated.priority)
    }

    @Test
    fun `approved question answer can be cleared rejected and deleted without removing the item`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val item = captureService.ingest(
            TelegramIngestRequest(
                telegramUserId = "owner-1",
                telegramChatId = "chat-1",
                telegramMessageId = "msg-answer-clear",
                text = "What is Kotlin?"
            )
        )
        reviewService.approve(item.id)

        val cleared = itemService.updateItem(
            item.id,
            UpdateItemRequest(answerStatus = AnswerStatus.NONE)
        )
        assertEquals(AnswerStatus.NONE, cleared.answerStatus)
        assertEquals(null, cleared.answer)
        assertEquals(ItemStatus.HUMAN_EDITED_APPROVED, cleared.status)

        val rejected = itemService.updateItem(
            item.id,
            UpdateItemRequest(answerStatus = AnswerStatus.REJECTED)
        )
        assertEquals(AnswerStatus.REJECTED, rejected.answerStatus)
        assertEquals(null, rejected.answer)

        val deleted = itemService.updateItem(
            item.id,
            UpdateItemRequest(answerStatus = AnswerStatus.DELETED)
        )
        assertEquals(AnswerStatus.DELETED, deleted.answerStatus)
        assertEquals(null, deleted.answer)
    }

    @Test
    fun `query filters approved items by type`() {
        val itemStore = InMemoryItemStore()
        val categoryService = createCategoryService(itemStore)
        val processingService = createProcessingService(itemStore, categoryService)
        val captureService = TelegramCaptureService(itemStore, categoryService, processingService, testProperties())
        val itemService = ItemService(itemStore, categoryService, ItemQueryService())
        val reviewService = createReviewService(itemStore, itemService, processingService, categoryService)

        val reminderItem = captureService.ingest(
            TelegramIngestRequest(telegramUserId = "owner-1", telegramChatId = "chat-1", telegramMessageId = "msg-typeflt-1", text = "remember to call dentist")
        )
        reviewService.approve(reminderItem.id)

        val ideaItem = captureService.ingest(
            TelegramIngestRequest(telegramUserId = "owner-1", telegramChatId = "chat-1", telegramMessageId = "msg-typeflt-2", text = "idea for a new feature")
        )
        reviewService.approve(ideaItem.id)

        val questionItem = captureService.ingest(
            TelegramIngestRequest(telegramUserId = "owner-1", telegramChatId = "chat-1", telegramMessageId = "msg-typeflt-3", text = "How does gravity work?")
        )
        reviewService.approve(questionItem.id)

        val reminders = itemService.listApproved(ItemListQueryRequest(type = ItemType.REMINDER))
        assertEquals(1, reminders.size)
        assertEquals(reminderItem.id, reminders.single().id)

        val ideas = itemService.listApproved(ItemListQueryRequest(type = ItemType.IDEA))
        assertEquals(1, ideas.size)
        assertEquals(ideaItem.id, ideas.single().id)

        val questions = itemService.listApproved(ItemListQueryRequest(type = ItemType.QUESTION))
        assertEquals(1, questions.size)
        assertEquals(questionItem.id, questions.single().id)
    }

    private fun createCategoryService(itemStore: InMemoryItemStore): CategoryService =
        CategoryService(
            categoryStore = InMemoryCategoryStore(),
            itemStore = itemStore,
            properties = testProperties()
        )

    private fun createProcessingService(
        itemStore: InMemoryItemStore,
        categoryService: CategoryService,
        aiPort: MemoraAiPort = DeterministicMemoraAiPort(),
        voiceTranscriptionService: VoiceTranscriptionService = DisabledVoiceTranscriptionService()
    ): ItemProcessingService =
        ItemProcessingService(
            itemStore = itemStore,
            categoryService = categoryService,
            aiPort = aiPort,
            voiceTranscriptionService = voiceTranscriptionService,
            properties = testProperties(),
            executor = directExecutor()
        )

    private fun createReviewService(
        itemStore: InMemoryItemStore,
        itemService: ItemService,
        processingService: ItemProcessingService,
        categoryService: CategoryService
    ): ReviewService =
        ReviewService(
            itemStore = itemStore,
            itemService = itemService,
            itemProcessingService = processingService,
            itemQueryService = ItemQueryService(),
            categoryService = categoryService
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

    private fun testProperties(
        cookieSecure: Boolean = true,
        ownerTelegramUserId: String = "owner-1"
    ): MemoraProperties =
        MemoraProperties(
            http = MemoraProperties.Http(
                allowedOrigin = "http://localhost:5173"
            ),
            auth = MemoraProperties.Auth(
                appPassword = null,
                appPasswordHash = "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza",
                sessionDays = 30,
                cookieSecure = cookieSecure
            ),
            capture = MemoraProperties.Capture(
                botIngestToken = "bot-token",
                ownerTelegramUserId = ownerTelegramUserId
            ),
            category = MemoraProperties.Category(
                defaultPath = "Default/General"
            ),
            processing = MemoraProperties.Processing(
                transcriptionAutoRetryAttempts = 3,
                aiAutoRetryAttempts = 2
            )
        )
}
