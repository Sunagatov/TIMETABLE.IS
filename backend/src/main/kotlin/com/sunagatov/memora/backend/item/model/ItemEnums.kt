package com.sunagatov.memora.backend.item.model

enum class SourceType {
    TELEGRAM_TEXT,
    TELEGRAM_VOICE
}

enum class ItemType {
    IDEA,
    THOUGHT,
    QUESTION,
    REMINDER,
    OTHER
}

enum class ItemStatus {
    RECEIVED,
    TRANSCRIPTION_FAILED,
    @Suppress("unused") TRANSCRIBED, // defined; populated when transcription is implemented
    AI_PROCESSING_FAILED,
    AI_PROCESSED_UNREVIEWED,
    HUMAN_APPROVED,
    HUMAN_EDITED_APPROVED,
    REJECTED,
    DELETED;

    companion object {
        fun reviewableStatuses(): Set<ItemStatus> = setOf(AI_PROCESSED_UNREVIEWED)

        fun failureStatuses(): Set<ItemStatus> = setOf(TRANSCRIPTION_FAILED, AI_PROCESSING_FAILED)

        fun approvedStatuses(): Set<ItemStatus> = setOf(HUMAN_APPROVED, HUMAN_EDITED_APPROVED)
    }
}

enum class FailureStage {
    @Suppress("unused") RECEPTION,           // defined; used when initial acceptance itself fails
    @Suppress("unused") TELEGRAM_FILE_FETCH, // defined; used when voice file download from Telegram fails
    TRANSCRIPTION,
    AI_PROCESSING,
    @Suppress("unused") PERSISTENCE          // defined; used when durable storage fails
}

// All values are part of the V1 spec and deserialized from API requests by Jackson.
@Suppress("unused")
enum class Priority {
    URGENT_IMPORTANT,
    URGENT_NOT_IMPORTANT,
    NOT_URGENT_IMPORTANT,
    NOT_URGENT_NOT_IMPORTANT,
    NOT_APPLICABLE
}

enum class ProposedCategoryStatus {
    NONE,
    PENDING_REVIEW,
    APPROVED,
    REJECTED
}

enum class AnswerStatus {
    NONE,
    GENERATED,
    EDITED,
    REJECTED,
    DELETED,
    FAILED
}
