package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.backend.BackendGateway
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import org.slf4j.LoggerFactory

class FailureNotificationDeliverer(
    private val backendGateway: BackendGateway,
    private val messageSender: TelegramMessageSender
) {
    private val logger = LoggerFactory.getLogger(FailureNotificationDeliverer::class.java)
    private var consecutivePollingFailures = 0

    fun deliverPendingNotifications() {
        try {
            backendGateway.fetchFailureNotifications().forEach(::deliverSingleNotification)
            handlePollingRecovery()
        } catch (exception: Exception) {
            handlePollingFailure(exception)
        }
    }

    private fun deliverSingleNotification(notification: TelegramFailureNotification) {
        if (!sendNotification(notification)) {
            return
        }
        acknowledgeNotification(notification)
    }

    private fun sendNotification(notification: TelegramFailureNotification): Boolean =
        try {
            messageSender.sendMessage(
                notification.telegramChatId,
                BotMessages.failureNotification(notification)
            )
            true
        } catch (exception: Exception) {
            logger.error(
                "Failed to send failure notification id={} to Telegram chat={}",
                notification.notificationId,
                notification.telegramChatId,
                exception
            )
            false
        }

    private fun acknowledgeNotification(notification: TelegramFailureNotification) {
        try {
            backendGateway.acknowledgeFailureNotification(notification.notificationId)
        } catch (exception: Exception) {
            logger.error(
                "Failed to acknowledge delivered failure notification id={}",
                notification.notificationId,
                exception
            )
        }
    }

    private fun handlePollingFailure(exception: Exception) {
        consecutivePollingFailures += 1
        if (consecutivePollingFailures == 1) {
            logger.error("Failed to fetch backend failure notifications", exception)
            return
        }

        logger.warn(
            "Backend failure notification polling still failing; consecutiveFailures={}, reason={}",
            consecutivePollingFailures,
            exception.message ?: "unknown"
        )
    }

    private fun handlePollingRecovery() {
        if (consecutivePollingFailures == 0) {
            return
        }

        logger.info(
            "Backend failure notification polling recovered after {} consecutive failure(s)",
            consecutivePollingFailures
        )
        consecutivePollingFailures = 0
    }
}
