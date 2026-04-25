package com.sunagatov.memora.telegrambot.bot

import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient
import org.telegram.telegrambots.meta.api.methods.send.SendMessage

interface TelegramMessageSender {
    fun sendMessage(chatId: String, text: String)
}

class TelegramClientMessageSender(
    private val telegramClient: OkHttpTelegramClient
) : TelegramMessageSender {

    override fun sendMessage(chatId: String, text: String) {
        telegramClient.execute(
            SendMessage.builder()
                .chatId(chatId)
                .text(text)
                .build()
        )
    }
}
