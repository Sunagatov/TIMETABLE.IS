package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendGateway
import com.sunagatov.memora.telegrambot.command.StartCommandHandler
import com.sunagatov.memora.telegrambot.config.BotSettings
import com.sunagatov.memora.telegrambot.ingest.TelegramUpdateMapper
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer
import org.telegram.telegrambots.meta.api.objects.Update

class MemoraLongPollingBot(
    private val updateHandler: TelegramUpdateHandler,
    private val failureNotificationDeliverer: FailureNotificationDeliverer
) : LongPollingUpdateConsumer {

    override fun consume(updates: MutableList<Update>) {
        updates.forEach(updateHandler::handle)
    }

    fun deliverFailureNotifications() {
        failureNotificationDeliverer.deliverPendingNotifications()
    }

    companion object {
        fun create(
            settings: BotSettings,
            messageSender: TelegramMessageSender,
            backendGateway: BackendGateway,
            updateMapper: TelegramUpdateMapper,
            startCommandHandler: StartCommandHandler
        ): MemoraLongPollingBot {
            val updateHandler = TelegramUpdateHandler(
                settings = settings,
                messageSender = messageSender,
                backendGateway = backendGateway,
                updateMapper = updateMapper,
                startCommandHandler = startCommandHandler
            )
            val failureNotificationDeliverer = FailureNotificationDeliverer(
                backendGateway = backendGateway,
                messageSender = messageSender
            )
            return MemoraLongPollingBot(updateHandler, failureNotificationDeliverer)
        }
    }
}
