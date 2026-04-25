# Telegram Bot

Telegram bot is the thin Memora transport adapter for Telegram long polling.

## Boundary

The bot:
- accepts messages only from `OWNER_TELEGRAM_USER_ID`
- forwards supported Telegram message metadata to the backend
- acknowledges accepted backend items
- polls backend failure notifications and delivers them to Telegram

The bot does not:
- write to the database
- transcribe voice notes
- call Whisper or AI services
- own category, review, retry, or item lifecycle logic

Backend is the source of truth.

## Supported Inputs

- text messages
- voice notes

One Telegram message creates one backend item, except bot commands never create items.

## Commands

- `/start`
- `/help`

Both commands return the same help message and are not forwarded to backend ingest.

Unknown slash commands are not ingested. The owner receives supported-input guidance.

## Unsupported Messages

For the authorized owner, unsupported message types receive:

```text
Supported inputs: text messages and voice notes. Commands: /start, /help.
```

Unauthorized users are ignored.

## Environment

Required:

| Variable | Default | Purpose |
|---|---:|---|
| `TELEGRAM_BOT_TOKEN` | none | Telegram bot token. Must not be a placeholder. |
| `BACKEND_BOT_INGEST_TOKEN` | none | Shared token sent as `X-Memora-Bot-Token`. |
| `OWNER_TELEGRAM_USER_ID` | none | Positive numeric Telegram user id allowed to use the bot. |

Optional:

| Variable | Default | Purpose |
|---|---:|---|
| `BACKEND_BASE_URL` | `http://localhost:8080` | Backend base URL, `http` or `https`. |
| `BACKEND_TELEGRAM_INGEST_PATH` | `/api/capture/telegram/ingest` | Unified text/voice ingest path. |
| `BACKEND_FAILURE_NOTIFICATIONS_PATH` | `/api/capture/telegram/failure-notifications` | Failure notification polling path. |
| `BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE` | `/api/capture/telegram/failure-notifications/%s/delivered` | Delivery acknowledgement path template. |
| `FAILURE_POLL_INTERVAL_SECONDS` | `5` | Poll interval, minimum 1 second. |
| `BACKEND_TIMEOUT_SECONDS` | `10` | Backend connect/request timeout, minimum 1 second. |

Do not put real Telegram tokens in docs, examples, or committed files.

## Backend Dependency

The bot requires the Memora backend endpoints:

- `POST /api/capture/telegram/ingest`
- `GET /api/capture/telegram/failure-notifications`
- `POST /api/capture/telegram/failure-notifications/{notificationId}/delivered`

All backend calls include `X-Memora-Bot-Token`.

Failure polling is stateful only for logging: the first consecutive backend-down failure logs the exception, repeats log concise warnings, and recovery is logged once. Delivery state remains backend-owned.

Failure notification parsing accepts both backend response shapes currently supported by the bot: a raw JSON array and an object wrapper with a `notifications` array. Delivery acknowledgement URL-encodes `notificationId` before inserting it into the acknowledgement path.

## Local Commands

Run locally:

```bash
cd telegram-bot
./gradlew run
```

Run tests:

```bash
cd telegram-bot
./gradlew test
```

Build Docker image:

```bash
cd telegram-bot
docker build -t memora-telegrambot-local .
```

## Manual Smoke Test

With the backend and bot running:
- send `/start` and `/help`; each should return help text and create no backend item
- send text; bot should reply `Accepted. Processing asynchronously. Memora ID: <id>`
- send a voice note; bot should reply with the same accepted format
- send an unsupported owner message; bot should return supported-input guidance
- stop the backend; bot should keep running and avoid repeated full stack traces while polling
- restart the backend; bot should log polling recovery
