package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendGateway
import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramAcceptedResponse
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import org.slf4j.LoggerFactory
import org.telegram.telegrambots.meta.api.objects.Update

class TelegramUpdateHandler(
    private val settings: BotSettings,
    private val messageSender: TelegramMessageSender,
    private val backendGateway: BackendGateway,
    private val updateMapper: TelegramUpdateMapper,
    private val startCommandHandler: StartCommandHandler
) {
    private val logger = LoggerFactory.getLogger(TelegramUpdateHandler::class.java)

    fun handle(update: Update) {
        val message = update.message ?: return
        val from = message.from ?: return
        val chatId = message.chatId.toString()

        if (from.id != settings.ownerTelegramUserId) {
            logger.warn("Ignoring update from unauthorized Telegram user id={}", from.id)
            return
        }

        when {
            isKnownCommand(message.text) -> messageSender.sendMessage(chatId, startCommandHandler.buildMessage())
            isCommand(message.text) -> messageSender.sendMessage(chatId, BotMessages.supportedInput)
            else -> ingestOrExplain(chatId, update)
        }
    }

    private fun ingestOrExplain(chatId: String, update: Update) {
        updateMapper.toTextIngestRequest(update)?.let {
            acceptIngest(chatId, "backend-ingest-text") { backendGateway.ingestText(it) }
            return
        }

        updateMapper.toVoiceIngestRequest(update)?.let {
            acceptIngest(chatId, "backend-ingest-voice") { backendGateway.ingestVoice(it) }
            return
        }

        messageSender.sendMessage(chatId, BotMessages.supportedInput)
    }

    private fun acceptIngest(
        chatId: String,
        stage: String,
        action: () -> TelegramAcceptedResponse
    ) {
        try {
            val accepted = action()
            messageSender.sendMessage(chatId, BotMessages.accepted(accepted.memoraId))
        } catch (exception: Exception) {
            logger.error("Failed to process Telegram update at stage={}", stage, exception)
            messageSender.sendMessage(
                chatId,
                BotMessages.processingFailure(stage, exception.message ?: "unknown")
            )
        }
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
