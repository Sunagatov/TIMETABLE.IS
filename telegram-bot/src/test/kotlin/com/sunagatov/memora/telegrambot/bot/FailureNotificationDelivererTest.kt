package com.sunagatov.memora.telegrambot.bot

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class FailureNotificationDelivererTest {

    @Test
    fun `failure notification is sent and acknowledged`() {
        val backend = RecordingBackendGateway(
            failureNotifications = listOf(failureNotification("n-1"))
        )
        val sender = RecordingMessageSender()
        val deliverer = FailureNotificationDeliverer(backend, sender)

        deliverer.deliverPendingNotifications()

        assertEquals(
            listOf(
                SentMessage(
                    "456",
                    BotMessages.failureNotification(failureNotification("n-1"))
                )
            ),
            sender.messages
        )
        assertEquals(listOf("n-1"), backend.acknowledgedNotificationIds)
    }

    @Test
    fun `failure notification with retry context includes retry context`() {
        val backend = RecordingBackendGateway(
            failureNotifications = listOf(
                failureNotification("n-1", retryContext = "transcriptionRetries=2/2")
            )
        )
        val sender = RecordingMessageSender()
        val deliverer = FailureNotificationDeliverer(backend, sender)

        deliverer.deliverPendingNotifications()

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
        val deliverer = FailureNotificationDeliverer(backend, sender)

        deliverer.deliverPendingNotifications()

        assertEquals(listOf("send-fails-chat", "456", "456"), sender.attemptedChatIds)
        assertEquals(listOf("ack-fails", "succeeds"), backend.acknowledgedNotificationIds)
        assertEquals(2, sender.messages.size)
    }

    @Test
    fun `polling fetch failure is swallowed`() {
        val backend = RecordingBackendGateway(fetchException = IllegalStateException("backend unavailable"))
        val sender = RecordingMessageSender()
        val deliverer = FailureNotificationDeliverer(backend, sender)

        deliverer.deliverPendingNotifications()

        assertEquals(emptyList(), sender.messages)
        assertEquals(emptyList(), backend.acknowledgedNotificationIds)
    }
}
