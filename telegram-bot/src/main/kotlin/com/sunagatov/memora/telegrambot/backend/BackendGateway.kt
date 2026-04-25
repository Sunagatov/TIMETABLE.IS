package com.sunagatov.memora.telegrambot.backend

import com.sunagatov.memora.telegrambot.ingest.TelegramAcceptedResponse
import com.sunagatov.memora.telegrambot.ingest.TelegramFailureNotification
import com.sunagatov.memora.telegrambot.ingest.TelegramIngestRequest

interface BackendGateway {
    fun ingestText(request: TelegramIngestRequest): TelegramAcceptedResponse
    fun ingestVoice(request: TelegramIngestRequest): TelegramAcceptedResponse
    fun fetchFailureNotifications(): List<TelegramFailureNotification>
    fun acknowledgeFailureNotification(notificationId: String)
}
