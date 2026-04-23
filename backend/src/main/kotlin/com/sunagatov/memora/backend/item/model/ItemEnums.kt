package com.sunagatov.memora.backend.item.model

enum class SourceType {
    TELEGRAM_TEXT,
    TELEGRAM_VOICE
}

enum class ItemType {
    IDEA,
    THOUGHT,
    REMINDER,
    OTHER
}

enum class ItemStatus {
    RECEIVED,
    TRANSCRIPTION_FAILED,
    TRANSCRIBED,
    AI_PROCESSING_FAILED,
    AI_PROCESSED_UNREVIEWED,
    HUMAN_APPROVED,
    HUMAN_EDITED_APPROVED,
    REJECTED,
    DELETED
}

enum class Priority {
    URGENT_IMPORTANT,
    URGENT_NOT_IMPORTANT,
    NOT_URGENT_IMPORTANT,
    NOT_URGENT_NOT_IMPORTANT,
    NOT_APPLICABLE
}
