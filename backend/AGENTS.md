# backend/AGENTS.md

## Purpose

Backend is Memora's source of truth.

## Tech stack

- Kotlin
- Spring Boot
- Jackson (JSON)
- bcrypt (password hashing)
- In-memory stores (Mongo persistence is a later phase)

## Responsibilities

- item lifecycle
- auth/session handling
- telegram ingest API
- bot-facing failure notification delivery
- review queue APIs
- category CRUD baseline
- future client-agnostic business logic

## Structural rule

Prefer feature/domain/area packages.

Current areas:
- `auth`
- `capture`
- `category`
- `common`
- `config`
- `health`
- `item`
- `review`

Do not drift back into a broad global technical-layer structure.

## Item lifecycle / status machine

```
RECEIVED
  ↓ (text processing succeeds)
AI_PROCESSED_UNREVIEWED
  ↓ approve               → HUMAN_APPROVED
  ↓ edit-and-approve      → HUMAN_EDITED_APPROVED
  ↓ reject                → REJECTED

RECEIVED
  ↓ (voice processing, always fails in bootstrap)
TRANSCRIPTION_FAILED

AI_PROCESSING_FAILED     (text processing fails after retries)

TRANSCRIPTION_FAILED | AI_PROCESSING_FAILED
  ↓ retry               → RECEIVED (re-enqueued)

HUMAN_APPROVED | HUMAN_EDITED_APPROVED
  ↓ direct PATCH        → HUMAN_EDITED_APPROVED (stays approved)

Any status
  ↓ deleteToTrash       → DELETED
```

## State guards

- `approve`: only `AI_PROCESSED_UNREVIEWED`
- `reject`: only `AI_PROCESSED_UNREVIEWED`
- `edit-and-approve`: only `AI_PROCESSED_UNREVIEWED`
- `retry`: only `TRANSCRIPTION_FAILED` or `AI_PROCESSING_FAILED`
- `updateItem` (PATCH): only `HUMAN_APPROVED` or `HUMAN_EDITED_APPROVED`
- `deleteToTrash`: any status

## Filter params — ItemListQueryRequest

All three list endpoints share the same query param model:
- `keyword` — searches title, cleanedText, rawTranscript, rawInputText, answer
- `type` — IDEA | THOUGHT | QUESTION | REMINDER | OTHER
- `status` — exact ItemStatus enum value
- `priority` — URGENT_IMPORTANT | URGENT_NOT_IMPORTANT | NOT_URGENT_IMPORTANT | NOT_URGENT_NOT_IMPORTANT | NOT_APPLICABLE
- `category`, `subcategory`, `subsubcategory` — partial or full 3-level path (each level optional)
- `createdFrom`, `createdTo` — ISO date (YYYY-MM-DD), inclusive range via UTC day boundaries
- `sort` — format `field-direction`
  - fields: `createdAt`, `title`, `category`
  - directions: `asc`, `desc`
  - default if omitted: `createdAt-desc`

**Warning:** Frontend and backend must use the same param names. The historical bug was `dateFrom`/`dateTo` vs `createdFrom`/`createdTo`. Current correct name is `createdFrom`/`createdTo`.

## Category invariants

- Exactly 3 levels: `category`, `subcategory`, `subsubcategory` — all required, non-blank
- `CategoryService.rename()` cascades `categoryPath` on all linked items
- `CategoryService.rename()` does NOT update `aiCategoryPath` — original AI output is preserved
- `CategoryService.delete()` blocked if any item uses that path
- `CategoryService.delete()` blocked for the configured default category path
- Duplicate path creation rejected
- `CategoryService.requireExistingPath()` validates category exists before assigning to item

## Failure notification contract

- `notificationId` format: `"${item.id}:${item.updatedAt.epochSecond}"` — re-derived each poll
- Only items with `telegramTrace.telegramChatId` produce notifications
- `retryContext` format: `"transcriptionRetries=N/MAX, aiRetries=N/MAX"`
- Once acknowledged via `/delivered`, `notificationStore.isDelivered()` suppresses re-delivery
- If item is retried and fails again, `updatedAt` changes → new `notificationId` → re-deliverable

## Security

- Session auth filter: rejects all `/api/**` except `/api/health`, `/api/auth/**`, `/api/capture/telegram/**`
- Bot auth filter: requires `X-Memora-Bot-Token` header for all `/api/capture/telegram/**`
- Spring Security config uses `anyRequest().permitAll()` — actual enforcement is in custom filters

## Config keys (application.yml / env vars)

- `BACKEND_ALLOWED_ORIGIN` (default: `http://localhost:5173`)
- `BACKEND_APP_PASSWORD_HASH` (bcrypt hash of app password)
- `BACKEND_SESSION_DAYS` (default: 30)
- `BACKEND_BOT_INGEST_TOKEN`
- `MEMORA_OWNER_TELEGRAM_USER_ID` (String, compared to `request.telegramUserId`)
- `DEFAULT_CATEGORY_PATH` (format: `Level1/Level2/Level3`, default: `Default/General/Inbox`)
- `MEMORA_TRANSCRIPTION_AUTO_RETRY_ATTEMPTS` (default: 3)
- `MEMORA_AI_AUTO_RETRY_ATTEMPTS` (default: 2)
- `MONGODB_URI` (default: `mongodb://localhost:27017/memora`)

## Rules

- do not let Telegram-specific concepts define domain logic
- prefer explicit services/use cases over framework-driven magic
- keep controllers thin
- keep status transitions explicit
- keep bootstrap code runnable
- do not move deployment/runtime concerns here
- keep category paths exactly 3 levels in V1
- preserve original AI output separately from latest human-facing item values
- keep direct `PATCH /api/items/{itemId}` approved-only
- use `edit-and-approve` for reviewable edits
- keep unified Telegram ingest at one backend endpoint with nested voice payload
- use in-memory stores until a task explicitly upgrades persistence

## Testing patterns

- All service tests in `FoundationServicesTests.kt` (unit-style, in-memory stores)
- `directExecutor()` runs `ItemProcessingService` synchronously — enables state assertions immediately after `ingest()`
- `testProperties()` helper provides valid bcrypt hash and sane defaults
- `MemoraBackendApplicationTests` — Spring context load test only
- Current test count: 19 in `FoundationServicesTests` + 1 context load = 20 total

Tests that must remain green:
- owner-only ingest (non-owner throws)
- xor validation (both text+voice rejected; neither rejected)
- text ingest → AI_PROCESSED_UNREVIEWED
- voice ingest → TRANSCRIPTION_FAILED
- category rename cascades to item.categoryPath but not aiCategoryPath
- approved edits stay approved
- approved query with keyword/status/sort filters
- failure notifications: exposed once, suppressed after ack
- direct PATCH rejected for non-approved item
- edit-and-approve rejected for already-approved item
- retry rejected for reviewable item
- category delete blocked when non-empty

## Current validation

```
cd backend && ./gradlew compileKotlin
cd backend && ./gradlew test
```
