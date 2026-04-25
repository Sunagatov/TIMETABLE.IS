package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class TelegramUpdateHandlerTest {

    @Test
    fun `start and help commands are not ingested`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithText("/start"))
        handler.handle(updateWithText("/help"))

        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
        assertEquals(2, sender.messages.size)
        assertTrue(sender.messages.all { it.text.contains("Memora bot is running.") })
    }

    @Test
    fun `unknown commands are not ingested`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithText("/unknown"))

        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
        assertEquals(listOf(SentMessage("456", BotMessages.supportedInput)), sender.messages)
    }

    @Test
    fun `unsupported owner messages receive supported input guidance`() {
        val sender = RecordingMessageSender()
        val handler = handler(RecordingBackendGateway(), sender)

        handler.handle(updateWithEmptyMessage())

        assertEquals(listOf(SentMessage("456", BotMessages.supportedInput)), sender.messages)
    }

    @Test
    fun `unsupported unauthorized messages are ignored`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithEmptyMessage(userId = 999L))

        assertEquals(emptyList(), sender.messages)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
    }

    @Test
    fun `authorized text message calls backend once and sends accepted memora id`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithText("remember this"))

        assertEquals(1, backend.textRequests.size)
        assertEquals("remember this", backend.textRequests.single().text)
        assertEquals(emptyList(), backend.voiceRequests)
        assertEquals(
            listOf(SentMessage("456", BotMessages.accepted("item-text"))),
            sender.messages
        )
    }

    @Test
    fun `authorized voice message calls backend once and sends accepted memora id`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithVoice())

        assertEquals(1, backend.voiceRequests.size)
        assertEquals("file-id", backend.voiceRequests.single().voice?.fileId)
        assertEquals(12345L, backend.voiceRequests.single().voice?.fileSizeBytes)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(
            listOf(SentMessage("456", BotMessages.accepted("item-voice"))),
            sender.messages
        )
    }

    @Test
    fun `unauthorized text message sends no reply and does not call backend`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithText("remember this", userId = 999L))

        assertEquals(emptyList(), sender.messages)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
    }

    @Test
    fun `unauthorized voice message sends no reply and does not call backend`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithVoice(userId = 999L))

        assertEquals(emptyList(), sender.messages)
        assertEquals(emptyList(), backend.textRequests)
        assertEquals(emptyList(), backend.voiceRequests)
    }

    @Test
    fun `backend ingest failure sends useful failure message with stage and reason`() {
        val backend = RecordingBackendGateway(textException = IllegalStateException("backend unavailable"))
        val sender = RecordingMessageSender()
        val handler = handler(backend, sender)

        handler.handle(updateWithText("remember this"))

        assertEquals(1, backend.textRequests.size)
        assertEquals(1, sender.messages.size)
        assertTrue(sender.messages.single().text.contains("Failed to process message."))
        assertTrue(sender.messages.single().text.contains("Stage: backend-ingest-text"))
        assertTrue(sender.messages.single().text.contains("Reason: backend unavailable"))
    }

    private fun handler(
        backend: RecordingBackendGateway,
        sender: RecordingMessageSender
    ): TelegramUpdateHandler =
        TelegramUpdateHandler(
            settings = botSettings(),
            messageSender = sender,
            backendGateway = backend,
            updateMapper = TelegramUpdateMapper(),
            startCommandHandler = StartCommandHandler()
        )
}
