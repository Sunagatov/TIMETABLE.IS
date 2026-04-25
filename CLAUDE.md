# CLAUDE.md

## Purpose

Compact guidance for Claude CLI.

## Core instructions

- Respect `docs/requirements/` first.
- Respect Vault boundary.
- Keep Memora feature-oriented, not globally layer-oriented.
- Keep code easy to extend for the next AI agent.
- Do not widen scope silently.
- Prefer current uppercase requirement files when both uppercase and legacy lowercase variants exist.
- Keep the current contract snapshot in `docs/ai/current-bootstrap-state.md` and `docs/ai/api-surface.md` aligned with code changes.

## Implementation bias

Prefer:

- feature/domain packages
- thin controllers / handlers
- explicit application services
- boring DTOs
- explicit status transitions
- clear names
- small files

Avoid:

- speculative abstractions
- framework-heavy indirection
- cross-repo deployment changes here
- top-level controller/service/repository package sprawl

## Read before coding

1. `AGENTS.md`
2. `docs/ai/current-bootstrap-state.md`
3. `docs/ai/api-surface.md` when the task touches endpoint, DTO, or filter param contracts
4. `docs/ai/invariants.md` when the task touches state transitions, category behavior, or filter params
5. `docs/ai/request-routing-guide.md`
6. relevant files under `docs/requirements/`
7. smallest relevant subproject `AGENTS.md`

## Current backend reality

- backend foundation packages: `auth`, `capture`, `category`, `common`, `config`, `health`, `item`, `review`, `transcription`
- backend item model separates original AI output from latest human-facing values
- category path is exactly 3 levels in V1; rename cascades to items; aiCategoryPath is not updated
- Telegram ingest is unified at `POST /api/capture/telegram/ingest` with exactly one of text or nested voice payload
- Telegram bot currently uses long polling, and bot-facing failure notifications are polled from the backend and acknowledged after delivery
- **voice transcription is live in production** — backed by self-hosted `whisper-worker` (`fedirz/faster-whisper-server`) on `whisper-network`; backend posts to `http://whisper-worker:8000/v1/audio/transcriptions`
- voice success path: RECEIVED → transcription → AI processing → AI_PROCESSED_UNREVIEWED; failure path → TRANSCRIPTION_FAILED
- approved items stay approved after direct human edits; reviewable edits go through `edit-and-approve`
- single-user auth uses backend-managed session cookies and password-hash config
- **MongoDB is active in production** — `spring.mongodb.uri` is the correct Spring Boot 4 property; `spring.data.mongodb.uri` is error-level deprecated and completely ignored at runtime

## Spring Boot 4 critical facts

- Property: `spring.mongodb.uri` (NOT `spring.data.mongodb.uri` — that was Spring Boot 3; in Boot 4 it is error-level deprecated and silently ignored)
- Env var to override MongoDB URI: `SPRING_MONGODB_URI` (maps to `spring.mongodb.uri`)
- In `application.yml`, the URI is read via: `spring.mongodb.uri: ${MONGODB_URI:mongodb://localhost:27017/memora}`
- If you set `SPRING_DATA_MONGODB_URI` or use `-Dspring.data.mongodb.uri`, the backend will silently connect to `localhost:27017` and crash in a container environment

## Current frontend reality

- React 19 + TypeScript + Vite 7 + TanStack React Query v5 + Tailwind v4
- all 3 list views (Needs Review, Failures, Approved) use backend-backed queries — do not revert to client-side filtering
- filter date params are `createdFrom` and `createdTo` (not `dateFrom`/`dateTo`) — mismatch silently breaks filtering
- sort format: `field-direction` (e.g. `createdAt-desc`, `title-asc`)
- `buildQuery()` in `reviewApi.ts` strips undefined values and "ALL" sentinel before sending to backend
- `useReviewActions` hook handles all item actions and `refreshAll()` cache invalidation
- `FilterControls.tsx` contains shared: `FilterSelect`, `DateField`, `ResetButton`, `CategoryCascade`
- `CategoryTree` in sidebar provides collapsible 3-level browsing; category management in collapsible section
- `UnauthorizedError` dispatches `memora:unauthorized` event for global session redirect

## Key contract facts

- `notificationId` for failure notifications: `"${item.id}:${item.updatedAt.epochSecond}"` — re-derived each poll
- `ownerTelegramUserId` on backend is a String; on bot it's a Long; bot sends `from.id.toString()` to backend
- state guards: approve/reject/edit-and-approve → reviewable only; retry → failed only; PATCH → approved only; trash → any
- category delete blocked if path used by any item or if it is the default category path
- `aiCategoryPath` intentionally NOT updated on rename; `categoryPath` IS updated on rename

## Testing patterns

- backend tests in `FoundationServicesTests.kt`, unit-style with in-memory stores
- use `directExecutor()` for synchronous processing to allow state assertions after `ingest()`
- use `testProperties()` helper for consistent config
- state guard tests use `assertFailsWith<IllegalArgumentException>`
- run: `cd backend && ./gradlew test`
- frontend: `cd frontend && npm run build`
