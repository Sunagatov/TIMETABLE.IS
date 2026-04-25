package com.sunagatov.memora.telegrambot.ingest

import org.telegram.telegrambots.meta.api.objects.Update
import org.telegram.telegrambots.meta.api.objects.User
import org.telegram.telegrambots.meta.api.objects.Voice
import org.telegram.telegrambots.meta.api.objects.chat.Chat
import org.telegram.telegrambots.meta.api.objects.message.Message
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class TelegramUpdateMapperTest {

    private val mapper = TelegramUpdateMapper()

    @Test
    fun `maps text messages`() {
        val request = mapper.toTextIngestRequest(updateWithMessage(text = "remember this"))

        assertNotNull(request)
        assertEquals("123", request.telegramUserId)
        assertEquals("456", request.telegramChatId)
        assertEquals("789", request.telegramMessageId)
        assertEquals("remember this", request.text)
        assertNull(request.voice)
    }

    @Test
    fun `maps voice messages`() {
        val request = mapper.toVoiceIngestRequest(updateWithMessage(voice = voice()))

        assertNotNull(request)
        assertEquals("123", request.telegramUserId)
        assertEquals("456", request.telegramChatId)
        assertEquals("789", request.telegramMessageId)
        assertNull(request.text)
        assertEquals("file-id", request.voice?.fileId)
        assertEquals("file-unique-id", request.voice?.fileUniqueId)
        assertEquals(7, request.voice?.durationSeconds)
        assertEquals("audio/ogg", request.voice?.mimeType)
    }

    @Test
    fun `ignores blank text`() {
        assertNull(mapper.toTextIngestRequest(updateWithMessage(text = "   ")))
    }

    private fun updateWithMessage(text: String? = null, voice: Voice? = null): Update {
        val update = Update()
        update.message = Message.builder()
            .messageId(789)
            .from(User.builder().id(123L).firstName("Owner").isBot(false).build())
            .chat(Chat.builder().id(456L).type("private").build())
            .text(text)
            .voice(voice)
            .build()
        return update
    }

    private fun voice(): Voice =
        Voice().apply {
            fileId = "file-id"
            fileUniqueId = "file-unique-id"
            duration = 7
            mimeType = "audio/ogg"
        }
}
