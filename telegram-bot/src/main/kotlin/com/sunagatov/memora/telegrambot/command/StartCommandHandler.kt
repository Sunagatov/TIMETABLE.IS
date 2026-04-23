package com.sunagatov.memora.telegrambot.command

class StartCommandHandler {
    fun buildMessage(): String =
        "Memora bot is running.\n\n" +
            "Send:\n" +
            "- a text message\n" +
            "- or a voice note\n\n" +
            "The bot will:\n" +
            "- accept it\n" +
            "- forward it to backend\n" +
            "- return a stable Memora item id\n" +
            "- keep backend as the source of truth"
}
