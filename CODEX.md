# CODEX.md

## Purpose

Compact guidance for Codex CLI.

## Core instructions

- Read the docs before coding.
- Keep the repo aligned with feature/domain structure.
- Backend must stay reusable beyond Telegram.
- Do not copy deployment/runtime logic into this repository.
- Stay within V1 scope unless the user explicitly expands it.
- Prefer current uppercase requirement files when both uppercase and legacy lowercase variants exist.
- Keep `docs/ai/current-bootstrap-state.md` and `docs/ai/api-surface.md` in sync with concrete contract changes.

## Preferred workflow

1. read `AGENTS.md`
2. read `docs/ai/current-bootstrap-state.md`
3. read `docs/ai/api-surface.md` when contracts, filter params, or state guards matter
4. read `docs/ai/invariants.md` when touching state transitions, category behavior
5. read `docs/ai/request-routing-guide.md`
6. identify the smallest affected domain area
7. implement one clear slice
8. update docs if behavior changed

## Preferred style

- simple > clever
- explicit > magical
- feature-oriented > global technical layers
- maintainable > hyper-abstract

## Current backend reality

- current backend packages: `auth`, `capture`, `category`, `common`, `config`, `health`, `item`, `review`, `transcription`
- `MemoraItem` preserves original AI output and latest human-facing state separately
- category paths are exact 3-level leaf paths, not arbitrary-depth trees; rename cascades to items; `aiCategoryPath` is NOT updated
- approved items stay approved after human edits in V1 (direct PATCH → `HUMAN_EDITED_APPROVED`)
- unified Telegram ingest uses `POST /api/capture/telegram/ingest` with text or nested voice payload
- Telegram bot currently uses long polling; bot failure notifications are an explicit backend contract delivered by backend polling and delivery acknowledgement
- direct item patch is approved-only; reviewable edits use `edit-and-approve`
- **voice transcription is live in production** via self-hosted `whisper-worker`; backend calls `http://whisper-worker:8000/v1/audio/transcriptions`; success path → AI_PROCESSED_UNREVIEWED
- **MongoDB is active in production** — not in-memory; in-memory stores are test-only
- filter params for list endpoints: keyword, type, priority, status, category, subcategory, subsubcategory, `createdFrom`, `createdTo`, sort
- sort format: `field-direction` e.g. `createdAt-desc`, `title-asc`
- state guards enforced by backend services (not Spring Security):
  - approve/reject/edit-and-approve: only `AI_PROCESSED_UNREVIEWED`
  - retry: only `TRANSCRIPTION_FAILED` or `AI_PROCESSING_FAILED`
  - PATCH: only `HUMAN_APPROVED` or `HUMAN_EDITED_APPROVED`

## Current Telegram bot reality

- Kotlin long-polling thin adapter in `telegram-bot/`; use `telegram-bot/AGENTS.md` before bot work
- no backend business logic belongs in the bot: no DB writes, transcription, Whisper/AI calls, category/review/item lifecycle logic, or retry state
- commands `/start` and `/help` are local-only and never forwarded as captured text
- supported owner messages are text and voice; unsupported owner messages get short supported-input guidance
- unauthorized users are ignored
- bot uses `BACKEND_TIMEOUT_SECONDS` for Java HttpClient connect timeout and backend request timeouts
- failure polling acknowledges backend notifications after Telegram delivery; repeated backend-down polling logs must stay concise
- `BackendClient` keeps failure-notification parsing compatible with both raw arrays and `{ "notifications": [...] }`
- acknowledgement `notificationId` is URL-encoded as a path segment
- never print, commit, or document real Telegram tokens or bot shared tokens

## Spring Boot 4 critical fact

`spring.data.mongodb.uri` is error-level deprecated since Spring Boot 4.0.0 and completely ignored at runtime.
Use `spring.mongodb.uri` (in `application.yml`) or `SPRING_MONGODB_URI` env var.
Getting this wrong causes a silent fallback to `localhost:27017`, making the container crash-loop with MongoDB connection errors.

## Current frontend reality

- React 19 + TypeScript + Vite 7 + TanStack React Query v5 + Tailwind v4
- all 3 list views use backend-backed queries (not client-side filtering)
- filter date params: `createdFrom`/`createdTo` — must match backend exactly
- "ALL" sentinel in filter state is stripped by `buildQuery()` before sending to backend
- `useReviewActions` hook for all item actions
- `FilterControls.tsx` shared: FilterSelect, DateField, ResetButton, CategoryCascade
- collapsible 3-level CategoryTree in sidebar + category management section

## Critical naming to preserve

- date filter params: `createdFrom` and `createdTo` (NOT `dateFrom`/`dateTo`)
- sort format: `createdAt-asc`, `createdAt-desc`, `title-asc`, `title-desc`, `category-asc`, `category-desc`
- failure notification ID: `"${item.id}:${item.updatedAt.epochSecond}"` — re-derived each poll

## Validation shortcuts

- backend: `cd backend && ./gradlew test`
- telegram bot: `cd telegram-bot && ./gradlew clean test`
- frontend: `cd frontend && npm run build`
- there is no root `./gradlew`; use subproject wrappers for backend and telegram bot
