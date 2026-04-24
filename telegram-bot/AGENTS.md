# telegram-bot/AGENTS.md

## Purpose

Telegram bot is a thin Memora transport adapter.

## Tech stack

- Kotlin
- Telegram long polling (not webhook)
- Jackson for JSON (jacksonObjectMapper)
- Java HttpClient for backend calls

## Rules

- keep it thin
- keep it boring
- keep it transport-focused
- current implementation is Telegram long polling, not webhook delivery
- do not move core domain logic here
- follow feature/area structure similar to current organization
- use the unified backend ingest contract and nested voice payload
- poll backend failure notifications instead of inventing local retry state

## Current areas

- `config` — BotSettings (all config from env vars)
- `backend` — BackendClient (HTTP calls to backend)
- `ingest` — TelegramUpdateMapper, TelegramIngestRequest DTOs
- `command` — StartCommandHandler
- `bot` — MemoraLongPollingBot (message dispatch + failure notification delivery)

## Backend endpoints used

- `POST /api/capture/telegram/ingest` — ingest text or voice message
- `GET /api/capture/telegram/failure-notifications` — poll pending notifications
- `POST /api/capture/telegram/failure-notifications/{notificationId}/delivered` — acknowledge delivery

All capture endpoints require `X-Memora-Bot-Token` header.

## Ingest contract

- `telegramUserId`: `from.id.toString()` (Long → String)
- `telegramChatId`: `message.chatId.toString()` (Long → String)
- `telegramMessageId`: `message.messageId.toString()` (Int → String)
- voice: nested `TelegramVoicePayload` with `fileId`, `fileUniqueId`, optional `durationSeconds`, `mimeType`
- response: `TelegramAcceptedResponse` with `memoraId`

## Owner validation

Bot-side: `from.id` (Long) compared to `settings.ownerTelegramUserId` (Long, from `OWNER_TELEGRAM_USER_ID` env var).
Backend-side: `request.telegramUserId` (String) compared to `MEMORA_OWNER_TELEGRAM_USER_ID` config (String).
Both must match the same actual user ID — they use compatible types on their respective sides.

## Failure notification flow

1. `deliverFailureNotifications()` called on a scheduled interval
2. `BackendClient.fetchFailureNotifications()` fetches pending list
3. For each notification: send message to Telegram, then acknowledge via `/delivered`
4. `notificationId` format: `"${item.id}:${item.updatedAt.epochSecond}"` — not persisted, re-derived each poll
5. Acknowledgement is one-shot (stored in backend's in-memory FailureNotificationStore)

## Failure notification message format

Sent to `telegramChatId`:
```
Processing failed.
Memora ID: <memoraId>
Failed stage: <failedStage>
Summary: <summary>
Retry context: <retryContext>  ← only if present
```

## Config keys (all from env vars via BotSettings.fromEnvironment())

- `TELEGRAM_BOT_TOKEN`
- `BACKEND_BASE_URL`
- `BACKEND_BOT_INGEST_TOKEN`
- `OWNER_TELEGRAM_USER_ID` — parsed as Long
- `BACKEND_TELEGRAM_INGEST_PATH` (default: `/api/capture/telegram/ingest`)
- `BACKEND_FAILURE_NOTIFICATIONS_PATH` (default: `/api/capture/telegram/failure-notifications`)
- `BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE` (default: `/api/capture/telegram/failure-notifications/%s/delivered`)
- `FAILURE_POLL_INTERVAL_SECONDS` (default: `5`)
