# Implementation Order

This is a short index. Prefer `current-bootstrap-state.md` and `implementation-sequence.md` for the real current picture.

## Recommended order

### Phase 1 — backend foundation

- enums
- item model
- status transitions
- auth/session baseline
- in-memory store first
- telegram ingest endpoint
- review list/action endpoints
- item detail/update endpoints
- category CRUD baseline

### Phase 1 status

Already present in backend:
- explicit item lifecycle/status model with state guards
- in-memory item/session/category stores
- auth/session baseline
- Telegram ingest baseline (owner validation, xor text/voice)
- bot-facing failure notification endpoints
- review/failure/approved API baseline with filter/sort query params
- item detail/update baseline
- category CRUD baseline (rename cascades to items, delete blocks when non-empty)

### Phase 2 — frontend shell

- login page
- app shell
- needs review page with backend-backed filter/sort
- failures page with backend-backed filter/sort
- approved items page with backend-backed filter/sort
- item detail panel (AI output vs human-facing comparison)
- category sidebar (collapsible 3-level tree)
- category management UI (create, rename, delete)
- API client

Current shell status:
- all present as a backend-backed review-first workspace
- default landing is Needs Review
- all three views use backend query params (not client-side filtering)
- filter params: keyword, type, priority, status, category path, createdFrom, createdTo, sort
- sort format: `field-direction` (e.g. `createdAt-desc`)

### Phase 3 — telegram bot adapter

- owner user validation
- backend forwarder
- accepted message
- failure message

Current adapter status:
- present as a Kotlin thin adapter
- unified ingest contract is in place
- `/start` and `/help` are handled locally and never ingested
- owner text and voice messages are forwarded; unsupported owner messages receive guidance; unauthorized users are ignored
- failure notifications are polled from backend and delivered/acknowledged
- backend timeout config and non-spammy backend-down polling logs are in place

### Phase 4 — persistence upgrade

- replace in-memory item storage with MongoDB persistence
- keep API shape stable

### Phase 5 — processing pipeline

- transcription integration
- AI cleanup/classification integration
- continue improving backend-owned AI cleanup/classification without moving that logic into Telegram
