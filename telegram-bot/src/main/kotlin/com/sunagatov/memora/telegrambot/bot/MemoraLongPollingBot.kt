package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendClient
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import com.sunagatov.memora.telegrambot.ingest.TelegramIngestRequest
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import java.net.ConnectException
import java.net.UnknownHostException
import java.net.http.HttpTimeoutException
import java.nio.channels.UnresolvedAddressException
import org.slf4j.LoggerFactory
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer
import org.telegram.telegrambots.meta.api.methods.send.SendMessage
import org.telegram.telegrambots.meta.api.objects.Update

class MemoraLongPollingBot(
    private val settings: BotSettings,
    private val telegramClient: OkHttpTelegramClient,
    private val backendClient: BackendClient,
    private val updateMapper: TelegramUpdateMapper
) : LongPollingUpdateConsumer {

    private val logger = LoggerFactory.getLogger(MemoraLongPollingBot::class.java)

    override fun consume(updates: MutableList<Update>) {
        updates.forEach(::consumeSingle)
    }

    private fun consumeSingle(update: Update) {
        val message = update.message ?: return
        val from = message.from ?: return
        val chatId = message.chatId.toString()

        if (from.id != settings.ownerTelegramUserId) {
            logger.warn("Ignoring update from unauthorized Telegram user id={}", from.id)
            return
        }

        val textRequest = updateMapper.toTextIngestRequest(update)
        if (textRequest != null) {
            acceptText(chatId, textRequest)
            return
        }

        val voiceRequest = updateMapper.toVoiceIngestRequest(update)
        if (voiceRequest != null) {
            acceptVoice(chatId, voiceRequest)
        }
    }

    private fun acceptText(
        chatId: String,
        request: TelegramIngestRequest
    ) {
        try {
            val accepted = backendClient.ingestText(request)
            sendMessage(chatId, "Accepted. Processing asynchronously. Memora ID: ${accepted.memoraId}")
        } catch (exception: Exception) {
            logger.error("Failed to ingest Telegram text update", exception)
            sendMessage(chatId, backendUnavailableMessageOrDefault(exception))
        }
    }

    private fun acceptVoice(
        chatId: String,
        request: TelegramIngestRequest
    ) {
        try {
            val accepted = backendClient.ingestVoice(request)
            sendMessage(chatId, "Accepted. Processing asynchronously. Memora ID: ${accepted.memoraId}")
        } catch (exception: Exception) {
            logger.error("Failed to ingest Telegram voice update", exception)
            sendMessage(chatId, backendUnavailableMessageOrDefault(exception))
        }
    }

    fun deliverFailureNotifications() {
        try {
            backendClient.fetchFailureNotifications().forEach { notification ->
                sendFailureNotification(notification)
                backendClient.acknowledgeFailureNotification(notification.notificationId)
            }
        } catch (exception: Exception) {
            if (isBackendUnavailable(exception)) {
                logger.warn(
                    "Skipping failure notification poll because backend is unreachable at {}",
                    settings.backendBaseUrl
                )
            } else {
                logger.error("Failed to deliver backend failure notifications", exception)
            }
        }
    }

    private fun sendFailureNotification(notification: TelegramFailureNotification) {
        val lines = mutableListOf(
            "Processing failed.",
            "Memora ID: ${notification.memoraId}",
            "Failed stage: ${notification.failedStage}",
            "Summary: ${notification.summary}"
        )
        notification.retryContext
            ?.takeIf { it.isNotBlank() }
            ?.let { lines += "Retry context: $it" }

        sendMessage(notification.telegramChatId, lines.joinToString("\n"))
    }

    private fun sendMessage(chatId: String, text: String) {
        telegramClient.execute(
            SendMessage.builder()
                .chatId(chatId)
                .text(text)
                .build()
        )
    }

    private fun backendUnavailableMessageOrDefault(exception: Exception): String =
        if (isBackendUnavailable(exception)) {
            "Memora backend is unavailable right now. Please retry in a moment."
        } else {
            "Memora could not accept this message right now. Please retry."
        }

    private fun isBackendUnavailable(exception: Throwable): Boolean =
        generateSequence(exception) { it.cause }
            .any {
                it is ConnectException ||
                    it is UnknownHostException ||
                    it is HttpTimeoutException ||
                    it is UnresolvedAddressException
            }
}
