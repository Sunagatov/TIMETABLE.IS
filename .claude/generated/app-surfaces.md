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

- authenticated app shell and shared API client
- backend-backed Needs Review / Failures / Approved workspace
- 3-level category tree and category management UI
- filter/sort query construction using backend param names

## telegram-bot/

Owns:

- Telegram long-poll update handling
- owner sender validation
- local `/start` and `/help` command replies
- forwarding supported owner text/voice inputs to backend unified ingest
- unsupported owner input guidance
- backend failure notification polling, Telegram delivery, and acknowledgement
- backend timeout and concise backend-down polling logs

Does not own:

- DB writes
- transcription or Whisper calls
- AI/category/review/item lifecycle logic
- retry state

## Not owned here

- deployment
- Docker / infra
- monitoring / ops
- production secrets workflow

Those belong outside this repo.
