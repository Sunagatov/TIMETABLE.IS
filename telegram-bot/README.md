# Telegram Bot

Kotlin-based thin Telegram adapter for Memora.

## Local run

Prerequisites:

- Java 25
- Gradle installed locally

Run:

```bash
cd telegram-bot
gradle run
```

## Required env vars

- `TELEGRAM_BOT_TOKEN`
- `OWNER_TELEGRAM_USER_ID`
- `BACKEND_BASE_URL`
- `BACKEND_BOT_INGEST_TOKEN`

## Important rule

This bot is only a transport adapter.

Backend owns the real business logic.
