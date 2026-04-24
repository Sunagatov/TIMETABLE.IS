package com.sunagatov.memora.backend.transcription.application

import com.sunagatov.memora.backend.config.MemoraProperties
import com.sunagatov.memora.backend.item.model.MemoraItem
import com.sunagatov.memora.backend.transcription.infrastructure.OpenAiAudioTranscriptionClient
import com.sunagatov.memora.backend.transcription.infrastructure.TelegramVoiceDownloader
import com.sunagatov.memora.backend.transcription.infrastructure.TranscriptionAudioPreparer
import org.springframework.stereotype.Service

@Service
class OpenAiCompatibleVoiceTranscriptionService(
    private val properties: MemoraProperties,
    private val telegramVoiceDownloader: TelegramVoiceDownloader,
    private val transcriptionAudioPreparer: TranscriptionAudioPreparer,
    private val openAiAudioTranscriptionClient: OpenAiAudioTranscriptionClient
) : VoiceTranscriptionService {

    override fun transcribe(item: MemoraItem): String {
        require(properties.telegramBotToken.isNotBlank()) {
            "Voice transcription requires MEMORA_TELEGRAM_BOT_TOKEN"
        }
        require(properties.transcriptionApiKey.isNotBlank()) {
            "Voice transcription requires MEMORA_TRANSCRIPTION_API_KEY"
        }

        val trace = item.telegramTrace
            ?: throw IllegalArgumentException("Voice item is missing Telegram trace metadata")

        val downloadedVoice = telegramVoiceDownloader.download(trace)
        val preparedAudio = transcriptionAudioPreparer.prepare(downloadedVoice)

        return openAiAudioTranscriptionClient.transcribe(preparedAudio).ifBlank {
            throw IllegalStateException("Transcription provider returned a blank transcript")
        }
    }
}
