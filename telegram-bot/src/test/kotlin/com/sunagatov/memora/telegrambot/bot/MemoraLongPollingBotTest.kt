package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendGateway
import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramAcceptedResponse
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import com.sunagatov.memora.telegrambot.ingest.TelegramIngestRequest
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import org.telegram.telegrambots.meta.api.objects.Update
import org.telegram.telegrambots.meta.api.objects.User
import org.telegram.telegrambots.meta.api.objects.Voice
import org.telegram.telegrambots.meta.api.objects.chat.Chat
import org.telegram.telegrambots.meta.api.objects.message.Message
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class MemoraLongPollingBotTest {

    @Test
    fun `start and help commands are not ingested`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithText("/start")))
        bot.consume(mutableListOf(updateWithText("/help")))

        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
        assertEquals(2, sender.messages.size)
        assertTrue(sender.messages.all { it.text.contains("Memora bot is running.") })
    }

    @Test
    fun `unknown commands are not ingested`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithText("/unknown")))

        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
        assertEquals(listOf(SentMessage("456", supportedInputMessage)), sender.messages)
    }

    @Test
    fun `unsupported owner messages receive supported input guidance`() {
        val sender = RecordingMessageSender()
        val bot = bot(RecordingBackendGateway(), sender)

        bot.consume(mutableListOf(updateWithEmptyMessage()))

        assertEquals(listOf(SentMessage("456", supportedInputMessage)), sender.messages)
    }

    @Test
    fun `unsupported unauthorized messages are ignored`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithEmptyMessage(userId = 999L)))

        assertEquals(emptyList(), sender.messages)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
    }

    @Test
    fun `authorized text message calls backend once and sends accepted memora id`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithText("remember this")))

        assertEquals(1, backend.textRequests.size)
        assertEquals("remember this", backend.textRequests.single().text)
        assertEquals(emptyList(), backend.voiceRequests)
        assertEquals(
            listOf(SentMessage("456", "Accepted. Processing asynchronously. Memora ID: item-text")),
            sender.messages
        )
    }

    @Test
    fun `authorized voice message calls backend once and sends accepted memora id`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithVoice()))

        assertEquals(1, backend.voiceRequests.size)
        assertEquals("file-id", backend.voiceRequests.single().voice?.fileId)
        assertEquals(12345L, backend.voiceRequests.single().voice?.fileSizeBytes)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(
            listOf(SentMessage("456", "Accepted. Processing asynchronously. Memora ID: item-voice")),
            sender.messages
        )
    }

    @Test
    fun `unauthorized text message sends no reply and does not call backend`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithText("remember this", userId = 999L)))

        assertEquals(emptyList(), sender.messages)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
    }

    @Test
    fun `unauthorized voice message sends no reply and does not call backend`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithVoice(userId = 999L)))

        assertEquals(emptyList(), sender.messages)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
    }

    @Test
    fun `backend ingest failure sends useful failure message with stage and reason`() {
        val backend = RecordingBackendGateway(textException = IllegalStateException("backend unavailable"))
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithText("remember this")))

        assertEquals(1, backend.textRequests.size)
        assertEquals(1, sender.messages.size)
        assertTrue(sender.messages.single().text.contains("Failed to process message."))
        assertTrue(sender.messages.single().text.contains("Stage: backend-ingest-text"))
        assertTrue(sender.messages.single().text.contains("Reason: backend unavailable"))
    }

    @Test
    fun `failure notification is sent and acknowledged`() {
        val backend = RecordingBackendGateway(
            failureNotifications = listOf(failureNotification("n-1"))
        )
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.deliverFailureNotifications()

        assertEquals(
            listOf(
                SentMessage(
                    "456",
                    "Processing failed.\nMemora ID: item-1\nFailed stage: transcription\nSummary: failed"
                )
            ),
            sender.messages
        )
        assertEquals(listOf("n-1"), backend.acknowledgedNotificationIds)
    }

    @Test
    fun `failure notification with retry context includes retry context`() {
        val backend = RecordingBackendGateway(
            failureNotifications = listOf(failureNotification("n-1", retryContext = "transcriptionRetries=2/2"))
        )
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.deliverFailureNotifications()

        assertTrue(sender.messages.single().text.contains("Retry context: transcriptionRetries=2/2"))
        assertEquals(listOf("n-1"), backend.acknowledgedNotificationIds)
    }

    @Test
    fun `failure notification send and ack failures do not stop later notifications`() {
        val backend = RecordingBackendGateway(
            failureNotifications = listOf(
                failureNotification("send-fails", chatId = "send-fails-chat"),
                failureNotification("ack-fails"),
                failureNotification("succeeds")
            ),
            ackExceptionIds = setOf("ack-fails")
        )
        val sender = RecordingMessageSender(failingChatIds = setOf("send-fails-chat"))
        val bot = bot(backend, sender)

        bot.deliverFailureNotifications()

        assertEquals(listOf("send-fails-chat", "456", "456"), sender.attemptedChatIds)
        assertEquals(listOf("ack-fails", "succeeds"), backend.acknowledgedNotificationIds)
        assertEquals(2, sender.messages.size)
    }

    private fun bot(
        backend: BackendGateway,
        sender: TelegramMessageSender
    ): MemoraLongPollingBot =
        MemoraLongPollingBot(
            settings = settings(),
            messageSender = sender,
            backendClient = backend,
            updateMapper = TelegramUpdateMapper(),
            startCommandHandler = StartCommandHandler()
        )

    private fun settings(): BotSettings =
        BotSettings.fromMap(
            mapOf(
                "TELEGRAM_BOT_TOKEN" to "123456:test-token",
                "BACKEND_BOT_INGEST_TOKEN" to "secret",
                "OWNER_TELEGRAM_USER_ID" to "123"
            )
        )

    private fun updateWithText(text: String, userId: Long = 123L): Update =
        updateWithMessage(text = text, userId = userId)

    private fun updateWithVoice(userId: Long = 123L): Update =
        updateWithMessage(voice = voice(), userId = userId)

    private fun updateWithEmptyMessage(userId: Long = 123L): Update =
        updateWithMessage(userId = userId)

    private fun updateWithMessage(
        text: String? = null,
        voice: Voice? = null,
        userId: Long = 123L
    ): Update {
        val update = Update()
        update.message = Message.builder()
            .messageId(789)
            .from(User.builder().id(userId).firstName("Owner").isBot(false).build())
            .chat(Chat.builder().id(456L).type("private").build())
            .text(text)
            .voice(voice)
            .build()
        return update
    }

    private fun voice(): Voice =
        Voice().apply {
            fileId = "file-id"
            fileUniqueId = "file-unique-id"
            duration = 7
            mimeType = "audio/ogg"
            fileSize = 12345L
        }

    private fun failureNotification(
        id: String,
        chatId: String = "456",
        retryContext: String? = null
    ): TelegramFailureNotification =
        TelegramFailureNotification(
            notificationId = id,
            telegramChatId = chatId,
            memoraId = "item-1",
            failedStage = "transcription",
            summary = "failed",
            retryContext = retryContext
        )

    private class RecordingBackendGateway(
        private val textException: Exception? = null,
        private val failureNotifications: List<TelegramFailureNotification> = emptyList(),
        private val ackExceptionIds: Set<String> = emptySet()
    ) : BackendGateway {
        val textRequests = mutableListOf<TelegramIngestRequest>()
        val voiceRequests = mutableListOf<TelegramIngestRequest>()
        val acknowledgedNotificationIds = mutableListOf<String>()

        override fun ingestText(request: TelegramIngestRequest): TelegramAcceptedResponse {
            textRequests += request
            textException?.let { throw it }
            return TelegramAcceptedResponse(memoraId = "item-text")
        }

        override fun ingestVoice(request: TelegramIngestRequest): TelegramAcceptedResponse {
            voiceRequests += request
            return TelegramAcceptedResponse(memoraId = "item-voice")
        }

        override fun fetchFailureNotifications(): List<TelegramFailureNotification> =
            failureNotifications

        override fun acknowledgeFailureNotification(notificationId: String) {
            acknowledgedNotificationIds += notificationId
            if (notificationId in ackExceptionIds) {
                throw IllegalStateException("ack failed")
            }
        }
    }

    private class RecordingMessageSender(
        private val failingChatIds: Set<String> = emptySet()
    ) : TelegramMessageSender {
        val messages = mutableListOf<SentMessage>()
        val attemptedChatIds = mutableListOf<String>()

        override fun sendMessage(chatId: String, text: String) {
            attemptedChatIds += chatId
            if (chatId in failingChatIds) {
                throw IllegalStateException("send failed")
            }
            messages += SentMessage(chatId, text)
        }
    }

    private data class SentMessage(val chatId: String, val text: String)

    private companion object {
        const val supportedInputMessage = "Supported inputs: text messages and voice notes. Commands: /start, /help."
    }
}
