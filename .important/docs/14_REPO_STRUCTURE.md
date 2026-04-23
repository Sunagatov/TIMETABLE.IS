# Suggested Monorepo Structure

## High-level structure

```text
Memora/
  backend/
  frontend/
  telegram-bot/
  docs/
```

## Backend

Responsibilities:

- source of truth
- domain model
- application services / use cases
- persistence
- auth/session handling
- review workflow
- category management
- search/filter/sort
- retry/failure handling
- AI orchestration
- Telegram-facing API endpoints for bot adapter

## Frontend

Responsibilities:

- login screen
- session-aware app shell
- default Needs Review view
- Failures view
- approved list
- search/filter/sort UI
- category tree sidebar
- item detail/edit/review UI
- category management UI

## Telegram bot

Thin adapter only.
