# App surfaces — Memora

This is a cheap routing note for Claude CLI / Codex CLI.

## backend/

Owns:

- business logic
- item lifecycle
- review workflow
- failures and retries
- session/auth behavior
- search/filter/sort contracts
- AI orchestration
- bot-facing ingestion endpoints

## frontend/

Owns:

- login UI
- Needs Review
- Failures
- approved items list
- item detail/edit/review
- category management UI
- search/filter/sort UI
- category tree sidebar

## telegram-bot/

Owns:

- Telegram update handling
- sender validation
- forwarding accepted input to backend
- ack and failure messages

## Not owned here

- deployment
- Docker / infra
- monitoring / ops
- production secrets workflow

Those belong outside this repo.
