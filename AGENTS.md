# AGENTS.md

This repository is intentionally structured to be easy for:

- Claude CLI
- Codex CLI
- humans maintaining the project later

## Primary goal

Implement **Memora V1 MVP** exactly as defined in `docs/requirements/`, while preserving the current structure and engineering principles.

## Hard boundaries

- This repository owns **application source**, not production deployment files.
- Production/runtime/deployment files live in `Sunagatov/Vault`, especially `apps/memora/`.
- Backend is the source of truth.
- Telegram is an adapter, not the center of the architecture.
- Do not add out-of-scope features.
- Do not over-engineer.
- The current compact contract snapshot lives in `docs/ai/current-bootstrap-state.md` and `docs/ai/api-surface.md`.

## Structural rule

Prefer **domain / feature / area** oriented structure.

Examples of preferred style:

- backend: `auth`, `capture`, `category`, `item`, `review`
- frontend: `features/review`, `features/auth`, `shared/api`, `shared/ui`
- telegram bot: `bot`, `command`, `backend`, `ingest`

Avoid making the root package structure primarily technical like only:

- `controller`
- `service`
- `repository`
- `dao`
- `converter`

Those technical building blocks may exist **inside a feature package**, but should not dominate the whole project structure.

## Required read order before coding

1. `docs/ai/current-bootstrap-state.md` — what already exists and what is still starter-level
2. `docs/ai/api-surface.md` — endpoint contracts, filter params, state guards
3. `docs/ai/invariants.md` — non-negotiable rules
4. the smallest exact requirement file(s) for the task
5. relevant subproject guide:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`

Use `docs/ai/request-routing-guide.md` to decide what to read for each task type.

For current backend foundation work, the most common requirement files are:

- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/05_NON_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/07_SECURITY_AND_ACCESS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `docs/requirements/09_CLIENT_AND_API_BOUNDARIES.md`

## Current V1 state summary

### Backend
- explicit item lifecycle: RECEIVED → AI_PROCESSED_UNREVIEWED → approved/rejected/deleted, or → failure statuses
- state guards enforced: approve/reject/edit-and-approve (reviewable only), retry (failures only), PATCH (approved only)
- 3-level category CRUD: rename cascades to items, delete blocks when non-empty
- Telegram ingest: owner validation, text/voice xor, unified endpoint at `POST /api/capture/telegram/ingest`
- failure notifications: polled by bot, acknowledged after delivery, re-derivable after retry
- filter params for all list endpoints: keyword, type, priority, status, category, subcategory, subsubcategory, `createdFrom`, `createdTo`, sort
- sort format: `field-direction` (createdAt-desc, title-asc, category-desc, etc.)
- MongoDB persistence is active in production; in-memory stores are test-only
- voice transcription is **live** — `transcription/` package handles download → audio prep → OpenAI-compatible HTTP call to `http://whisper-worker:8000`
- AI categorization/answer generation: still stub/placeholder
- Spring Boot 4: MongoDB property is `spring.mongodb.uri` (not `spring.data.mongodb.uri` — deprecated at error level, completely ignored)

### Frontend
- review-first 3-column workspace: sidebar / item list / item detail
- all 3 list views backend-backed (Needs Review, Failures, Approved)
- filter bars for all 3 views; date params named `createdFrom`/`createdTo`
- collapsible 3-level CategoryTree in sidebar + category management UI
- item detail shows AI output vs human-facing comparison with per-view action buttons
- `buildQuery()` strips undefined and "ALL" before sending to backend

### Telegram bot
- Kotlin thin adapter, long polling
- owner user ID validation both bot-side (Long) and backend-side (String)
- handles `/start` and `/help` locally; commands never create backend items
- forwards only supported owner text/voice inputs to backend unified ingest
- replies to the authorized owner with supported-input guidance for unsupported inputs; unauthorized users are ignored
- failure notification polling + delivery acknowledgement
- backend HTTP timeout is configured by `BACKEND_TIMEOUT_SECONDS` (default 10)
- backend-down failure polling logs first failure with exception, repeated failures concisely, and recovery once

## Rules for all AI agents

- Keep code boring, explicit, and maintainable.
- Prefer small files when practical (aim for under ~350 LOC where practical).
- Avoid giant repo-wide rewrites unless requested.
- Prefer vertical slices over broad speculative refactors.
- Backend use cases/services must remain reusable by future non-Telegram clients.
- If requirements and code disagree, requirements win.
- If requirements are ambiguous, update docs first or ask for a decision instead of inventing behavior.
- Do not move deployment concerns into this repository.
- Prefer updating high-signal AI docs when concrete behavior or routing changed:
  - `docs/ai/current-bootstrap-state.md`
  - `docs/ai/api-surface.md`
  - `docs/ai/repo-map.md`
  - `docs/ai/invariants.md`
  - scoped `AGENTS.md` files (`backend/`, `frontend/`, `telegram-bot/`)
- Preserve these stable V1 contracts unless the requirements change:
  - unified Telegram ingest at `POST /api/capture/telegram/ingest`
  - bot-facing failure notification polling and delivery acknowledgement
  - Telegram bot remains a thin transport adapter; no transcription, AI/category/review, DB writes, or local retry state
  - review-first workflow with separate Needs Review, Failures, and approved areas
  - direct `PATCH /api/items/{itemId}` for approved items only
  - reviewable edits through `POST /api/review/{itemId}/edit-and-approve`
  - exact 3-level category paths
  - filter date params named `createdFrom`/`createdTo` (not dateFrom/dateTo)
  - sort format: `field-direction`
