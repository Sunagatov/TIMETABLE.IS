# Suggested Implementation Sequence

This file helps AI agents and humans avoid working in the wrong order.

## Phase 1 — backend skeleton and domain/state contracts
- item model
- explicit lifecycle/status model
- category model
- review/failure state separation
- auth/session baseline

Current status:
- done
- MongoDB persistence is active in production (Spring Boot 4: use `spring.mongodb.uri`, not `spring.data.mongodb.uri`)
- in-memory stores are test-only

## Phase 2 — Telegram ingestion path
- owner validation
- message acceptance
- Memora ID generation
- async handoff
- acknowledgement/failure messaging

Current status:
- owner validation and message acceptance are present
- unified text and voice ingest contract exists
- Telegram bot local command handling exists for `/start` and `/help`; commands do not create items
- unsupported owner messages receive supported-input guidance; unauthorized users are ignored
- bot-facing failure notification polling and delivery acknowledgement exist
- backend timeout config and non-spammy repeated polling failure logs exist
- full async orchestration remains backend-owned work; do not move it into the bot

## Phase 3 — processing pipeline
- raw input persistence
- transcription path
- cleaned text generation
- type/category/priority inference
- failure handling

Current status (transcription sub-path):
- voice transcription is **live** in production — `faster-whisper-server` (`whisper-worker`) on `whisper-network`
- backend `transcription/` package: `OpenAiCompatibleVoiceTranscriptionService`, `OpenAiAudioTranscriptionClient`, `TelegramVoiceDownloader`, `TranscriptionAudioPreparer`
- runtime config: `MEMORA_TRANSCRIPTION_API_BASE_URL=http://whisper-worker:8000`, `MEMORA_TRANSCRIPTION_MODEL=Systran/faster-whisper-base`
- AI processing (categorization, answer generation) is still stub/placeholder

## Phase 4 — web review UI
- login
- Needs Review
- Failures
- approved list
- item detail/edit
- search/filter/sort
- category sidebar

Current status:
- complete as a backend-backed review-first workspace
- default landing is Needs Review
- all three views (Needs Review, Failures, Approved) use backend-backed query params
- query params: keyword, type, priority, status, category path (category/subcategory/subsubcategory), createdFrom, createdTo, sort
- item detail shows AI output vs human-facing comparison with all review actions

## Phase 5 — category management
- create
- rename
- move items
- delete empty categories

Current status:
- backend category CRUD baseline exists
- category rename cascades to linked items
- category delete is blocked when non-empty
- frontend category management UI is present (collapsible sidebar section with create/rename/delete)

## Rule

Do not jump to future-phase features before the review-first core is stable.
