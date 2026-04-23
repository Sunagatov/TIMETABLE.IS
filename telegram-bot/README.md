# Telegram Bot

This folder contains the Memora Telegram bot adapter.

## Role

The bot is intentionally thin.

It should:

- receive Telegram updates
- validate configured owner Telegram user ID
- forward accepted input to backend
- send immediate acknowledgement
- send failure notifications when backend requires them

It must not own core business logic.

## Product rule

In V1, one Telegram message becomes one Memora item.

## Important boundary

Telegram is not the source of truth.

Backend is the source of truth.

## Read next

- `telegram-bot/AGENTS.md`
- `docs/requirements/`
- `docs/ai/architecture.md`
