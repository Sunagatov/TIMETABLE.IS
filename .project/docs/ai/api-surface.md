# API Surface

This file is intentionally compact.

It exists to help agents avoid rediscovering the current backend foundation from source every time.

## Authentication

Current backend endpoints:
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Behavior notes:
- backend-managed session cookie
- single password checked against configured bcrypt hash
- session lifetime is configurable in days (default 30)
- frontend must send cookies with `credentials: "include"` and must not store auth tokens in browser storage
- frontend treats any session fetch failure as unauthenticated and uses 401 responses to return to login

## Capture ingestion

Current backend endpoint:
- `POST /api/capture/telegram/ingest`

Current request shape:
- exactly one of `text` or `voice` (xor enforced at request construction)
- `telegramUserId` as a string
- `telegramChatId` as a string
- `telegramMessageId` as a string
- `voice.fileId`
- `voice.fileUniqueId`
- optional voice media metadata: `durationSeconds`, `mimeType`, `fileSizeBytes`

Current behavior:
- owner Telegram user ID validated in backend against `MEMORA_OWNER_TELEGRAM_USER_ID` config
- `telegramUserId` in request must equal the configured owner string exactly
- blank/missing backend owner ID is rejected; ingest must never degrade to allow-all
- returns backend item ID as `memoraId` on accept responses only
- accepted items first stored as `RECEIVED`
- text items processed asynchronously into Needs Review (`AI_PROCESSED_UNREVIEWED`)
- QUESTION items may carry answer output plus answer status/failure metadata
- category inference may produce a pending-review proposal path separate from the current category path
- voice items persist traceability metadata including file size when provided; transcription is **live** (self-hosted whisper); success path: RECEIVED → AI_PROCESSED_UNREVIEWED; failure path: → TRANSCRIPTION_FAILED after retries
- bot-facing failure notifications exposed for polling and delivery acknowledgement
- capture endpoints authenticated with `X-Memora-Bot-Token`
- Telegram bot commands (`/start`, `/help`) are handled locally by the bot and must not call this endpoint
- unsupported Telegram message types are not ingested; the authorized owner receives supported-input guidance from the bot

Current bot-facing failure notification endpoints:
- `GET /api/capture/telegram/failure-notifications`
- `POST /api/capture/telegram/failure-notifications/{notificationId}/delivered`

Current failure notification payload:
- `notificationId` — format `"${item.id}:${item.updatedAt.epochSecond}"` (re-derived each poll)
- `telegramChatId`
- `memoraId`
- `failedStage`
- `summary`
- `retryContext` — separates manual retries from configured automatic attempts:
  `"manualTranscriptionRetries=N, manualAiRetries=N, autoTranscriptionAttempts=N, autoAiAttempts=N"`

Telegram bot compatibility notes:
- `GET /failure-notifications` parsing currently accepts both a raw JSON array and an object wrapper with a `notifications` array.
- `notificationId` can contain characters such as `:` and must be URL-encoded by the bot before formatting it into the acknowledgement path.
- failure delivery state remains backend-owned; the bot only logs polling failure streaks to avoid repeated stack-trace spam.

## Review

Current backend endpoints:
- `GET /api/review/needs-review`
- `GET /api/review/failures`
- `POST /api/review/{itemId}/approve`
- `POST /api/review/{itemId}/edit-and-approve`
- `POST /api/review/{itemId}/category-proposal/approve`
- `POST /api/review/{itemId}/category-proposal/reject`
- `POST /api/review/{itemId}/reject`
- `DELETE /api/review/{itemId}/trash`
- `POST /api/review/{itemId}/retry`
- `POST /api/review/{itemId}/regenerate-cleaned-text`
- `POST /api/review/{itemId}/regenerate-answer`
- `POST /api/review/{itemId}/regenerate-category-proposal`
- `POST /api/review/{itemId}/regenerate-all`

State guards:
- `approve`, `reject`, `edit-and-approve` — only `AI_PROCESSED_UNREVIEWED` items
- `retry` — only `TRANSCRIPTION_FAILED` or `AI_PROCESSING_FAILED` items
- `trash` — any status

Current behavior:
- `edit-and-approve` is the review-safe edit path for reviewable items
- retry requeues failed items back through the same backend-owned processing path
- regeneration actions update the current working values while preserving the original `ai*` snapshot fields
- answer regeneration is explicit and separate from the core review/failure retry path
- frontend must invalidate/refetch relevant React Query data after review actions; it must not fake approved/retried/deleted state locally

## Items

Current backend endpoints:
- `GET /api/items/approved`
- `GET /api/items/{itemId}`
- `PATCH /api/items/{itemId}`

State guards:
- `PATCH` — only `HUMAN_APPROVED` or `HUMAN_EDITED_APPROVED` items; always transitions to `HUMAN_EDITED_APPROVED`

Current behavior:
- approved item edits stay approved in V1 (result is always `HUMAN_EDITED_APPROVED`)
- editable fields: title, cleanedText, rawTranscript, type, 3-level categoryPath, priority, answer, answerStatus
- `MemoraItem` uses `id` as primary identifier; `memoraId` only appears in accept/notification payloads
- approved list endpoint returns only `HUMAN_APPROVED` and `HUMAN_EDITED_APPROVED` items
- answer status values include `NONE`, `GENERATED`, `EDITED`, `REJECTED`, `DELETED`, `FAILED`
- frontend direct save uses `PATCH` only for approved items; reviewable edits use `edit-and-approve`
- frontend should not send answer text for `NONE`, `REJECTED`, or `DELETED`; `GENERATED` and `EDITED` require non-blank answer text

## Search/filter/sort — query params

All three list endpoints accept these query params via `ItemListQueryRequest`:

| Param | Type | Notes |
|-------|------|-------|
| `keyword` | string | searches title, cleanedText, rawTranscript, rawInputText, answer |
| `type` | enum | IDEA, THOUGHT, QUESTION, REMINDER, OTHER |
| `status` | enum | exact ItemStatus value |
| `priority` | enum | URGENT_IMPORTANT, URGENT_NOT_IMPORTANT, NOT_URGENT_IMPORTANT, NOT_URGENT_NOT_IMPORTANT, NOT_APPLICABLE |
| `category` | string | exact level-1 match |
| `subcategory` | string | exact level-2 match |
| `subsubcategory` | string | exact level-3 match |
| `createdFrom` | date | ISO date YYYY-MM-DD, inclusive (UTC day start) |
| `createdTo` | date | ISO date YYYY-MM-DD, inclusive (UTC day end) |
| `sort` | string | format `field-direction`, e.g. `createdAt-desc` |

Sort fields: `createdAt`, `title`, `category`
Sort directions: `asc`, `desc`
Default sort: `createdAt-desc`

**Critical naming:** date params are `createdFrom`/`createdTo` — NOT `dateFrom`/`dateTo`.

## Category management

Current backend endpoints:
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/{categoryId}`
- `DELETE /api/categories/{categoryId}`

Current behavior:
- category paths are exact 3-level leaf paths only (category/subcategory/subsubcategory, all non-blank)
- default category path is bootstrapped automatically (`Default/General/Inbox`)
- category delete blocked if path is still used by any item
- category delete blocked for the default category path
- category rename cascades `categoryPath` on all linked items
- category rename does NOT update `aiCategoryPath` (preserves original AI output)
- category proposal approval may create and reuse a new path, tracked through `proposedCategoryPath` and `proposedCategoryStatus`

## Health

Current backend endpoint:
- `GET /api/health`
