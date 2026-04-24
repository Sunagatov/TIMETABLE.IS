# telegram-bot/AGENTS.md

## Purpose

Telegram bot is a thin Memora transport adapter.

## Rules

- keep it thin
- keep it boring
- keep it transport-focused
- current implementation is Telegram long polling, not webhook delivery
- do not move core domain logic here
- follow feature/area structure similar to Festiva-style bot organization
- current implementation is Kotlin
- use the unified backend ingest contract and nested voice payload
- poll backend failure notifications instead of inventing local retry state

## Current areas
- `config`
- `backend`
- `command`
- `ingest`
- `bot`
