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
            sendMessage(chatId, supportedInputMessage())
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

        sendMessage(chatId, supportedInputMessage())
    }

    private fun acceptIngest(
        chatId: String,
        stage: String,
        action: () -> TelegramAcceptedResponse
    ) {
        try {
            val accepted = action()
            sendMessage(
                chatId,
                "Accepted. Processing asynchronously. Memora ID: ${accepted.memoraId}"
            )
        } catch (exception: Exception) {
            logger.error("Failed to process Telegram update at stage={}", stage, exception)
            sendMessage(
                chatId,
                buildString {
                    append("Failed to process message.")
                    append("\nStage: ")
                    append(stage)
                    append("\nReason: ")
                    append(exception.message ?: "unknown")
                }
            )
        }
    }

    fun deliverFailureNotifications() {
        try {
            backendClient.fetchFailureNotifications().forEach { notification ->
                sendFailureNotification(notification)
                backendClient.acknowledgeFailureNotification(notification.notificationId)
            }
            if (consecutiveFailurePollingFailures > 0) {
                logger.info(
                    "Backend failure notification polling recovered after {} consecutive failure(s)",
                    consecutiveFailurePollingFailures
                )
                consecutiveFailurePollingFailures = 0
            }
        } catch (exception: Exception) {
            consecutiveFailurePollingFailures += 1
            if (consecutiveFailurePollingFailures == 1) {
                logger.error("Failed to deliver backend failure notifications", exception)
            } else {
                logger.warn(
                    "Backend failure notification polling still failing; consecutiveFailures={}, reason={}",
                    consecutiveFailurePollingFailures,
                    exception.message ?: "unknown"
                )
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

    private fun supportedInputMessage(): String =
        "Supported inputs: text messages and voice notes. Commands: /start, /help."
}
