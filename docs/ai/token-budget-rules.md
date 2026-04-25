# Token Budget Rules

## Default mindset

Repository context is expensive.

Prefer:
- one repo-level file
- one scoped file
- one or two compact docs
- exact feature files only
- `docs/ai/current-bootstrap-state.md` before rediscovering current backend status from code
- `docs/ai/api-surface.md` before reading controller source for endpoint/DTO shapes
- `backend/AGENTS.md` for filter param names, state guards, sort format, config keys

Avoid:
- whole-repo scans
- reading all three modules for one task
- repeating requirements that are already summarized
- carrying stale Memora assumptions into Memora
- trusting generated routing docs that point to nonexistent paths without checking `docs/ai/repo-map.md`

## Stop conditions

Do not load more files once you know:
- exact entry point
- exact files to change
- exact requirement/invariant involved
- smallest validation needed

## Compression strategy

Before opening more code, prefer:
- `docs/requirements/README.md`
- `docs/ai/repo-map.md`
- `docs/ai/architecture.md`
- `docs/ai/invariants.md`
- `docs/ai/current-bootstrap-state.md`
- `docs/ai/api-surface.md` when working on endpoints, DTOs, or filter params
- `backend/AGENTS.md` when touching state guards, category behavior, or test patterns
- `frontend/AGENTS.md` when touching filters, query keys, or component structure
- `docs/ai/implementation-sequence.md` for current completion status

## Known high-risk areas (read carefully before touching)

### Filter param names
Frontend sends `createdFrom`/`createdTo`. Backend reads `createdFrom`/`createdTo`.
**Do not change to `dateFrom`/`dateTo`.** This was a past bug that silently broke all date range filtering.

### Sort format
Backend parses sort as `field-direction` strings. Valid: `createdAt-asc`, `createdAt-desc`, `title-asc`, `title-desc`, `category-asc`, `category-desc`.
Do not invent new sort field names — `ItemQueryService.parseSort()` will throw `IllegalArgumentException`.

### Category path assignment
Before assigning a category path to an item, `CategoryService.requireExistingPath()` must be called.
It throws `IllegalArgumentException` if the path doesn't exist as a registered category.

### `aiCategoryPath` vs `categoryPath`
`CategoryService.rename()` updates `categoryPath` on linked items but intentionally does NOT update `aiCategoryPath`.
Do not change this behavior — it preserves original AI output history.

### `notificationId` format
Failure notification IDs are `"${item.id}:${item.updatedAt.epochSecond}"`.
They are re-derived each poll, not persisted. If an item is retried and fails again with a new `updatedAt`, a new `notificationId` is generated — allowing re-delivery.
Bot acknowledgement paths must URL-encode the notification ID as a path segment before formatting it into `/delivered`.

### Telegram bot thin-adapter boundary
The bot handles transport only:
- local commands: `/start`, `/help`
- supported owner inputs: text and voice
- unsupported owner input guidance
- backend ingest and failure notification polling/ack

Do not add DB access, transcription/Whisper calls, AI/category/review/item lifecycle logic, or retry state to the bot.
Failure notification parsing intentionally accepts both raw arrays and `{ "notifications": [...] }`.
Backend-down polling logs should not emit full stack traces every interval.

### Frontend "ALL" sentinel
Filter state uses `"ALL"` as the "no filter selected" sentinel for select dropdowns.
`buildQuery()` in `reviewApi.ts` strips it before building the URL. Never send `"ALL"` to backend.

### Spring Boot 4 MongoDB property name trap

`spring.data.mongodb.uri` is **error-level deprecated** in Spring Boot 4.0 and silently ignored at runtime.
The correct property is `spring.mongodb.uri`. Env var: `SPRING_MONGODB_URI`.
If you use the old property name (or `SPRING_DATA_MONGODB_URI`), the backend will connect to `localhost:27017` instead of the configured URI, and crash-loop in production.

In `application.yml` this is: `spring.mongodb.uri: ${MONGODB_URI:mongodb://localhost:27017/memora}`.

### Whisper network startup dependency

`memora-backend` container joins `whisper-network` as an external network.
`whisper-network` is created by `apps/whisper/docker-compose.yml`.
If whisper is not running when backend starts, Docker Compose will fail with a network-not-found error.
Deploy/start whisper first, then Memora backend.

## Editing strategy

- modify as few files as possible
- avoid stylistic churn during requirement-driven work
- avoid speculative abstractions
- avoid deployment assumptions that belong in Vault
- when changing filter params in any layer, update all three layers: backend DTO, frontend types, frontend filter bar components
