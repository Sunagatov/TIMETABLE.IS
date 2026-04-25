package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendGateway
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramAcceptedResponse
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import com.sunagatov.memora.telegrambot.ingest.TelegramIngestRequest
import org.telegram.telegrambots.meta.api.objects.Update
import org.telegram.telegrambots.meta.api.objects.User
import org.telegram.telegrambots.meta.api.objects.Voice
import org.telegram.telegrambots.meta.api.objects.chat.Chat
import org.telegram.telegrambots.meta.api.objects.message.Message

internal fun botSettings(): BotSettings =
    BotSettings.fromMap(
        mapOf(
            "TELEGRAM_BOT_TOKEN" to "123456:test-token",
            "BACKEND_BOT_INGEST_TOKEN" to "secret",
            "OWNER_TELEGRAM_USER_ID" to "123"
        )
    )

internal fun updateWithText(text: String, userId: Long = 123L): Update =
    updateWithMessage(text = text, userId = userId)

internal fun updateWithVoice(userId: Long = 123L): Update =
    updateWithMessage(voice = voice(), userId = userId)

internal fun updateWithEmptyMessage(userId: Long = 123L): Update =
    updateWithMessage(userId = userId)

internal fun updateWithMessage(
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

internal fun voice(): Voice =
    Voice().apply {
        fileId = "file-id"
        fileUniqueId = "file-unique-id"
        duration = 7
        mimeType = "audio/ogg"
        fileSize = 12345L
    }

internal fun failureNotification(
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

internal class RecordingBackendGateway(
    private val textException: Exception? = null,
    private val voiceException: Exception? = null,
    private val fetchException: Exception? = null,
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
        voiceException?.let { throw it }
        return TelegramAcceptedResponse(memoraId = "item-voice")
    }

    override fun fetchFailureNotifications(): List<TelegramFailureNotification> {
        fetchException?.let { throw it }
        return failureNotifications
    }

    override fun acknowledgeFailureNotification(notificationId: String) {
        acknowledgedNotificationIds += notificationId
        if (notificationId in ackExceptionIds) {
            throw IllegalStateException("ack failed")
        }
    }
}

internal class RecordingMessageSender(
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

internal data class SentMessage(val chatId: String, val text: String)
