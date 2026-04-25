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
- backend deterministic placeholder AI port for cleaned text, type, category proposal, answer generation, and regeneration actions
- backend direct item patch is approved-only; reviewable edits go through `edit-and-approve`
- backend in-memory stores for items, sessions, categories, and failure notifications
- backend voice transcription pipeline: Telegram voice download → audio preparation (ffmpeg fallback for unsupported formats) → OpenAI-compatible transcription API (`/v1/audio/transcriptions`), configured via `MEMORA_TRANSCRIPTION_API_KEY`, `MEMORA_TRANSCRIPTION_API_BASE_URL`, `MEMORA_TRANSCRIPTION_MODEL`, `MEMORA_TELEGRAM_BOT_TOKEN`
- frontend session-aware login + review workspace
- frontend review workspace includes Needs Review, Failures, and Approved areas with backend-backed queries for all three views
- frontend search/filter/sort for all three views: keyword, type, priority, status, category path, date range (`createdFrom`/`createdTo`), sort
- frontend category sidebar with collapsible 3-level tree and category management UI (create, rename, delete)
- frontend item detail panel with AI output vs human-facing value comparison and all review actions
- Kotlin telegram bot starter
- stable stack versions

## What is live in production

- MongoDB persistence is **active** — backend connects to a Mongo sidecar via `spring.mongodb.uri` (Spring Boot 4 property name; `spring.data.mongodb.uri` is error-level deprecated and ignored)
- Voice transcription is **active** — self-hosted `faster-whisper-server` (`whisper-worker`) runs under `whisper-network` in Vault; backend connects via `MEMORA_TRANSCRIPTION_API_BASE_URL=http://whisper-worker:8000`
- Deployment/runtime is owned by Vault (`apps/memora/`, `apps/whisper/`)

## What is still intentionally starter-level

- AI integration (categorization, answer generation) is not implemented yet — deterministic placeholder AI port is used
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
- voice ingest persists Telegram traceability metadata, is durably accepted first, and then reaches visible retryable transcription failure after bounded retries
- backend exposes bot-facing failure notification polling + delivery acknowledgement endpoints for failed Telegram items
- text ingest is durably accepted first, then processed asynchronously into Needs Review with normalized text, inferred type (including QUESTION detection), answer generation or answer failure visibility, and category proposal support
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
