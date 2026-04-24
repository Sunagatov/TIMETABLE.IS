package com.sunagatov.memora.backend.transcription.application

import com.sunagatov.memora.backend.item.model.MemoraItem

fun interface VoiceTranscriptionService {
    fun transcribe(item: MemoraItem): String
}

class DisabledVoiceTranscriptionService : VoiceTranscriptionService {
    override fun transcribe(item: MemoraItem): String =
        throw IllegalStateException(
            "Voice transcription is disabled in this construction path. " +
                "Use the Spring-managed bean for real transcription support."
        )
}
