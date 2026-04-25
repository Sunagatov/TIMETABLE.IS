# Current Bootstrap State

## Important truth

This repository now contains a **runnable starter** for backend, frontend, and telegram bot.

It is not yet the full target V1 implementation.

## What is already real

- root repo guidance and Vault boundary
- feature/domain-oriented package and folder direction
- backend auth/session baseline with password-hash checking and session cookie flow
- backend unified ingest baseline for Telegram text and nested voice metadata
- backend bot-facing failure notification polling and delivery acknowledgement endpoints
- backend review queue APIs for Needs Review, Failures, and approved items
- backend 3-level category model and CRUD baseline
- backend explicit item lifecycle/status model
- backend separation of original AI output vs latest human-facing item values, including `aiAnswer` vs `answer`, `proposedCategoryPath`/`proposedCategoryStatus`, and answer lifecycle state
- backend deterministic AI port for local/default cleaned text, type, category proposal, answer generation, and regeneration actions; optional OpenAI-compatible text AI adapter is selected by `MEMORA_AI_MODE=openai`
- backend Mongo-backed sessions by default; in-memory session store is test/local only with `MEMORA_STORAGE_MODE=in-memory`
- backend direct item patch is approved-only; reviewable edits go through `edit-and-approve`
- backend MongoDB persistence (Spring Boot 4; use `spring.mongodb.uri`, not `spring.data.mongodb.uri`)
- backend voice transcription pipeline (live in production): Telegram voice download → audio preparation (ffmpeg fallback for unsupported formats) → OpenAI-compatible transcription API (`/v1/audio/transcriptions`) — `transcription/` package: `OpenAiCompatibleVoiceTranscriptionService`, `OpenAiAudioTranscriptionClient`, `TelegramVoiceDownloader`, `TranscriptionAudioPreparer`
- frontend session-aware login + review workspace
- frontend review workspace includes Needs Review, Failures, and Approved areas with backend-backed queries for all three views
- frontend search/filter/sort for all three views: keyword, type, priority, status, category path, date range (`createdFrom`/`createdTo`), sort
- frontend category sidebar with collapsible 3-level tree and category management UI (create, rename, delete)
- frontend item detail panel with AI output vs human-facing value comparison and all review actions
- Kotlin telegram bot starter
- Telegram bot handles `/start` and `/help` locally, ignores unauthorized users, forwards only supported owner text/voice inputs, and polls backend failure notifications with non-spammy repeated-failure logging
- stable stack versions

## What is live in production

- MongoDB persistence is **active** — backend connects to a Mongo sidecar via `spring.mongodb.uri` (Spring Boot 4 property name; `spring.data.mongodb.uri` is error-level deprecated and ignored)
- Voice transcription is **active** — self-hosted `faster-whisper-server` (`whisper-worker`) runs under `whisper-network` in Vault; backend connects via `MEMORA_TRANSCRIPTION_API_BASE_URL=http://whisper-worker:8000`
- Deployment/runtime is owned by Vault (`apps/memora/`, `apps/whisper/`)

## What is still intentionally starter-level

- real text AI integration is optional and off by default — deterministic AI remains the default unless `MEMORA_AI_MODE=openai` and provider config are supplied
- deployment/runtime is still owned by Vault, not here

## Backend foundation details that already matter

- backend packages now include:
  - `auth`
  - `capture`
  - `category`
  - `common`
  - `config`
  - `health`
  - `item`
  - `review`
  - `transcription`
- voice ingest persists Telegram traceability metadata, is durably accepted first; in production reaches AI_PROCESSED_UNREVIEWED on success or TRANSCRIPTION_FAILED after retries
- backend exposes bot-facing failure notification polling + delivery acknowledgement endpoints for failed Telegram items
- text ingest is durably accepted first, then processed asynchronously into Needs Review with normalized text, inferred type (including QUESTION detection), answer generation or answer failure visibility, and category proposal support
- async processing maps HTTP/IO exceptions to visible failure states instead of leaving accepted items in `RECEIVED`
- approved item edits remain approved in V1; reviewable edits require `edit-and-approve`
- category paths are exact leaf paths with `category`, `subcategory`, `subsubcategory`
- default backend category path is configured through `DEFAULT_CATEGORY_PATH`
- single-user Telegram ingest is gated by configured owner Telegram user ID
- Telegram bot currently uses Telegram long polling, not webhook delivery
- all three list endpoints accept query params: `keyword`, `type`, `status`, `priority`, `category`, `subcategory`, `subsubcategory`, `createdFrom`, `createdTo`, `sort`
- review endpoints now include category-proposal approval/rejection and AI output regeneration actions

## Default backend validation

- `cd backend && ./gradlew compileKotlin`
- `cd backend && ./gradlew test`

## Why this state is useful

It gives Claude CLI / Codex CLI a clean, runnable, style-correct foundation instead of forcing them to start from a generic scaffold or from the wrong package shape.
