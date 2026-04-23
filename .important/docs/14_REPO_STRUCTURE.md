# Suggested Repo Structure

```text
Memora/
  docs/
  backend/
  frontend/
  telegram-bot/
  AGENTS.md
  CLAUDE.md
  CODEX.md
```

## Responsibilities

### backend/

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

### frontend/

- login screen
- session-aware app shell
- default Needs Review view
- Failures view
- approved list
- search/filter/sort UI
- category tree sidebar
- item detail/edit/review UI
- category management UI

### telegram-bot/

- receive Telegram updates
- validate sender
- forward input to backend
- send immediate acknowledgement
- send failure notifications when needed
