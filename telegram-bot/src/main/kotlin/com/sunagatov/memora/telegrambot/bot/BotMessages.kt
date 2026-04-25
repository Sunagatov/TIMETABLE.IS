package com.sunagatov.memora.telegrambot.bot

import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification

object BotMessages {
    const val supportedInput = "Supported inputs: text messages and voice notes. Commands: /start, /help."

    fun accepted(memoraId: String): String =
        "Accepted. Processing asynchronously. Memora ID: $memoraId"

    fun processingFailure(stage: String, reason: String): String =
        buildString {
            append("Failed to process message.")
            append("\nStage: ")
            append(stage)
            append("\nReason: ")
            append(reason)
        }

    fun failureNotification(notification: TelegramFailureNotification): String {
        val lines = mutableListOf(
            "Processing failed.",
            "Memora ID: ${notification.memoraId}",
            "Failed stage: ${notification.failedStage}",
            "Summary: ${notification.summary}"
        )
        notification.retryContext
            ?.takeIf { it.isNotBlank() }
            ?.let { lines += "Retry context: $it" }
        return lines.joinToString("\n")
    }
}
