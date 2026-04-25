package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendGateway
import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramAcceptedResponse
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import org.slf4j.LoggerFactory
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer
import org.telegram.telegrambots.meta.api.objects.Update

class MemoraLongPollingBot(
    private val settings: BotSettings,
    private val messageSender: TelegramMessageSender,
    private val backendClient: BackendGateway,
    private val updateMapper: TelegramUpdateMapper,
    private val startCommandHandler: StartCommandHandler
) : LongPollingUpdateConsumer {

    private val logger = LoggerFactory.getLogger(MemoraLongPollingBot::class.java)
    private var consecutiveFailurePollingFailures = 0

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

        if (isKnownCommand(message.text)) {
            sendMessage(chatId, startCommandHandler.buildMessage())
            return
        }
        if (isCommand(message.text)) {
            sendMessage(chatId, BotMessages.supportedInput)
            return
        }

        updateMapper.toTextIngestRequest(update)?.let {
            acceptIngest(chatId, "backend-ingest-text") { backendClient.ingestText(it) }
            return
        }

        updateMapper.toVoiceIngestRequest(update)?.let {
            acceptIngest(chatId, "backend-ingest-voice") { backendClient.ingestVoice(it) }
            return
        }

        sendMessage(chatId, BotMessages.supportedInput)
    }

    private fun acceptIngest(
        chatId: String,
        stage: String,
        action: () -> TelegramAcceptedResponse
    ) {
        try {
            val accepted = action()
            sendMessage(chatId, BotMessages.accepted(accepted.memoraId))
        } catch (exception: Exception) {
            logger.error("Failed to process Telegram update at stage={}", stage, exception)
            sendMessage(chatId, BotMessages.processingFailure(stage, exception.message ?: "unknown"))
        }
    }

    fun deliverFailureNotifications() {
        try {
            fetchPendingFailureNotifications().forEach(::deliverSingleFailureNotification)
            handleFailurePollingRecovery()
        } catch (exception: Exception) {
            handleFailurePollingFailure(exception)
        }
    }

    private fun fetchPendingFailureNotifications(): List<TelegramFailureNotification> =
        backendClient.fetchFailureNotifications()

    private fun deliverSingleFailureNotification(notification: TelegramFailureNotification) {
        try {
            sendFailureNotification(notification)
        } catch (exception: Exception) {
            logger.error(
                "Failed to send failure notification id={} to Telegram chat={}",
                notification.notificationId,
                notification.telegramChatId,
                exception
            )
            return
        }

        acknowledgeFailureNotification(notification)
    }

    private fun acknowledgeFailureNotification(notification: TelegramFailureNotification) {
        try {
            backendClient.acknowledgeFailureNotification(notification.notificationId)
        } catch (exception: Exception) {
            logger.error(
                "Failed to acknowledge delivered failure notification id={}",
                notification.notificationId,
                exception
            )
        }
    }

    private fun handleFailurePollingFailure(exception: Exception) {
        consecutiveFailurePollingFailures += 1
        if (consecutiveFailurePollingFailures == 1) {
            logger.error("Failed to fetch backend failure notifications", exception)
        } else {
            logger.warn(
                "Backend failure notification polling still failing; consecutiveFailures={}, reason={}",
                consecutiveFailurePollingFailures,
                exception.message ?: "unknown"
            )
        }
    }

    private fun handleFailurePollingRecovery() {
        if (consecutiveFailurePollingFailures > 0) {
            logger.info(
                "Backend failure notification polling recovered after {} consecutive failure(s)",
                consecutiveFailurePollingFailures
            )
            consecutiveFailurePollingFailures = 0
        }
    }

    private fun sendFailureNotification(notification: TelegramFailureNotification) {
        sendMessage(notification.telegramChatId, BotMessages.failureNotification(notification))
    }

    private fun sendMessage(chatId: String, text: String) {
        messageSender.sendMessage(chatId, text)
    }

    private fun isKnownCommand(text: String?): Boolean {
        val command = commandName(text)
        return command == "/start" || command == "/help"
    }

    private fun isCommand(text: String?): Boolean =
        commandName(text)?.startsWith("/") == true

    private fun commandName(text: String?): String? =
        text
            ?.trim()
            ?.substringBefore(" ")
            ?.substringBefore("@")
            ?.lowercase()

}
