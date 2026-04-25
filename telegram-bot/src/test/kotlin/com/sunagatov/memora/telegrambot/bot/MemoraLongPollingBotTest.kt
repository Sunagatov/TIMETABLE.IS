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
import org.telegram.telegrambots.meta.api.objects.chat.Chat
import org.telegram.telegrambots.meta.api.objects.message.Message
import kotlin.test.Test
import kotlin.test.assertEquals

class MemoraLongPollingBotTest {

    @Test
    fun `start and help commands are not ingested`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithText("/start")))
        bot.consume(mutableListOf(updateWithText("/help")))

        assertEquals(0, backend.ingestCalls)
        assertEquals(2, sender.messages.size)
        assertEquals(true, sender.messages.all { it.text.contains("Memora bot is running.") })
    }

    @Test
    fun `unsupported owner messages receive supported input guidance`() {
        val sender = RecordingMessageSender()
        val bot = bot(RecordingBackendGateway(), sender)

        bot.consume(mutableListOf(updateWithText("   ")))

        assertEquals(listOf(SentMessage("456", "Supported inputs: text messages and voice notes. Commands: /start, /help.")), sender.messages)
    }

    @Test
    fun `unknown commands are not ingested`() {
        val backend = RecordingBackendGateway()
        val sender = RecordingMessageSender()
        val bot = bot(backend, sender)

        bot.consume(mutableListOf(updateWithText("/unknown")))

        assertEquals(0, backend.ingestCalls)
        assertEquals(listOf(SentMessage("456", "Supported inputs: text messages and voice notes. Commands: /start, /help.")), sender.messages)
    }

    @Test
    fun `unsupported unauthorized messages are ignored`() {
        val sender = RecordingMessageSender()
        val bot = bot(RecordingBackendGateway(), sender)

        bot.consume(mutableListOf(updateWithText("   ", userId = 999L)))

        assertEquals(emptyList(), sender.messages)
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

    private fun updateWithText(text: String, userId: Long = 123L): Update {
        val update = Update()
        update.message = Message.builder()
            .messageId(789)
            .from(User.builder().id(userId).firstName("Owner").isBot(false).build())
            .chat(Chat.builder().id(456L).type("private").build())
            .text(text)
            .build()
        return update
    }

    private class RecordingBackendGateway : BackendGateway {
        var ingestCalls = 0

        override fun ingestText(request: TelegramIngestRequest): TelegramAcceptedResponse {
            ingestCalls += 1
            return TelegramAcceptedResponse(memoraId = "item-1")
        }

        override fun ingestVoice(request: TelegramIngestRequest): TelegramAcceptedResponse {
            ingestCalls += 1
            return TelegramAcceptedResponse(memoraId = "item-1")
        }

        override fun fetchFailureNotifications(): List<TelegramFailureNotification> = emptyList()

        override fun acknowledgeFailureNotification(notificationId: String) = Unit
    }

    private class RecordingMessageSender : TelegramMessageSender {
        val messages = mutableListOf<SentMessage>()

        override fun sendMessage(chatId: String, text: String) {
            messages += SentMessage(chatId, text)
        }
    }

    private data class SentMessage(val chatId: String, val text: String)
}
