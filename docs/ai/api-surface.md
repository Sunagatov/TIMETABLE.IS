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
- single password checked against configured password hash
- session lifetime is configurable in days

## Capture ingestion

Current backend endpoint:
- `POST /api/capture/telegram/ingest`

Current request shape:
- exactly one of `text` or `voice`
- `telegramUserId` as a string
- `telegramChatId` as a string
- `telegramMessageId` as a string
- `voice.fileId`
- `voice.fileUniqueId`
- optional voice media metadata: `durationSeconds`, `mimeType`

Current behavior:
- owner Telegram user ID is validated in backend
- returns backend item ID as `memoraId` on accept responses only
- accepted items are first stored as `RECEIVED`
- text items are then processed asynchronously into Needs Review
- voice items persist traceability metadata and currently end in visible transcription failure after bounded retries
- bot-facing failure notifications are exposed for polling and delivery acknowledgement
- current Telegram bot transport is long polling, and the backend capture/failure endpoints are authenticated with `X-Memora-Bot-Token`

Current bot-facing failure notification endpoints:
- `GET /api/capture/telegram/failure-notifications`
- `POST /api/capture/telegram/failure-notifications/{notificationId}/delivered`

Current failure notification payload:
- `notificationId`
- `telegramChatId`
- `memoraId`
- `failedStage`
- `summary`
- `retryContext`

## Review

Current backend endpoints:
- `GET /api/review/needs-review`
- `GET /api/review/failures`
- `POST /api/review/{itemId}/approve`
- `POST /api/review/{itemId}/edit-and-approve`
- `POST /api/review/{itemId}/reject`
- `DELETE /api/review/{itemId}/trash`
- `POST /api/review/{itemId}/retry`

Current behavior:
- `edit-and-approve` is the review-safe edit path
- direct item edits are not a replacement for review workflow
- retry requeues failed items back through the same backend-owned processing path
- list endpoints accept query params for keyword, type, status, priority, category path, created date range, and sort

## Items

Current backend endpoints:
- `GET /api/items/approved`
- `GET /api/items/{itemId}`
- `PATCH /api/items/{itemId}`

Current behavior:
- approved item edits stay approved in V1
- current editable fields include title, cleaned text, raw transcript, type, 3-level category path, priority
- `PATCH /api/items/{itemId}` is approved-only
- `MemoraItem` uses `id` as the primary item identifier; `memoraId` only appears in accept/notification payloads
- approved list endpoint accepts the same query params as review lists

## Category management

Current backend endpoints:
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/{categoryId}`
- `DELETE /api/categories/{categoryId}`

Current behavior:
- category paths are exact 3-level leaf paths only
- default category path is bootstrapped automatically
- category delete is blocked if the path is still used by items
- category rename updates linked item category assignments

## Search/filter/sort

Current backend support:
- keyword search
- filter by type/category/path/priority/status/date range
- sort by title/category/date

## Health

Current backend endpoint:
- `GET /api/health`
