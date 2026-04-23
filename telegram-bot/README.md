# Telegram Bot

Telegram bot is a thin Memora adapter.

## Structural style

This bot intentionally follows a **Festiva-like area structure** rather than one flat package.

Current areas:
- `config`
- `backend`
- `command`
- `ingest`
- `bot`

## Responsibility

The bot should:
- validate that messages come from the configured owner
- acknowledge accepted messages
- forward accepted messages to backend
- remain transport-focused

It should **not** become a second backend.

## Run locally

```bash
cd telegram-bot
./gradlew run
```
