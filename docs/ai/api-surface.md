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
- `telegramUserId`
- `telegramChatId`
- `telegramMessageId`
- `voice.fileId`
- `voice.fileUniqueId`
- optional voice media metadata

Current behavior:
- owner Telegram user ID is validated in backend
- returns backend item ID as `memoraId`
- text ingest lands in Needs Review
- voice ingest persists traceability metadata and currently lands in visible transcription failure

Current bot-facing failure notification endpoints:
- `GET /api/capture/telegram/failure-notifications`
- `POST /api/capture/telegram/failure-notifications/{notificationId}/delivered`

## Review

Current backend endpoints:
- `GET /api/review/needs-review`
- `GET /api/review/failures`
- `POST /api/review/{itemId}/approve`
- `POST /api/review/{itemId}/edit-and-approve`
- `POST /api/review/{itemId}/reject`
- `DELETE /api/review/{itemId}/trash`
- `POST /api/review/{itemId}/retry`

## Items

Current backend endpoints:
- `GET /api/items/approved`
- `GET /api/items/{itemId}`
- `PATCH /api/items/{itemId}`

Current behavior:
- approved item edits stay approved in V1
- current editable fields include title, cleaned text, raw transcript, type, 3-level category path, priority

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

Current frontend shell:
- keyword search
- filter by type/category/path/priority
- sort by title/category/date

Current backend limitation:
- approved search/filter/sort is still client-side because backend does not expose query endpoints yet

## Health

Current backend endpoint:
- `GET /api/health`
