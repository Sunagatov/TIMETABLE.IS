# App surfaces — Memora

This is a cheap routing note for Claude CLI / Codex CLI.

## backend/

Owns:

- business logic
- item lifecycle
- category path model and CRUD baseline
- review workflow
- failures and retries
- session/auth behavior
- item edit/approval contracts
- search/filter/sort contracts
- AI orchestration
- bot-facing ingestion endpoints

## frontend/

Owns:

- current app shell and shared API client
- future Needs Review / Failures / approved item UI

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
