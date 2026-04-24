# Architecture Summary

## Product shape

Memora is a single-user, review-first capture system.

### Capture
Telegram bot (thin adapter, Kotlin, long polling).

### Source of truth
Backend (Kotlin/Spring Boot).

### Review/search/edit
Web frontend (React 19, TypeScript, Vite 7, TanStack React Query v5, Tailwind v4).

## Runtime/source split

### Memora source repository
Owns source code, requirements, and implementation docs.

### Vault repository
Owns production/deployment/runtime truth.

## Confirmed source modules

### Backend
- Kotlin + Spring Boot
- source of truth and business logic owner
- explicit application services + in-memory stores (Mongo persistence is a later phase)
- session-based auth with bcrypt password hash
- bot-facing endpoints protected by `X-Memora-Bot-Token`
- current backend feature areas:
  - `auth` — login, logout, session check, session cookie
  - `capture` — Telegram ingest, failure notification polling/ack
  - `category` — 3-level category CRUD
  - `item` — item model, lifecycle, query service
  - `review` — needs-review/failures lists + approve/reject/retry/trash/edit-and-approve
  - `health` — `GET /api/health`

### Frontend
- React 19 + TypeScript + Vite 7
- TanStack React Query v5 (backend-backed queries for all 3 list views)
- Tailwind CSS v4
- `features/auth` and `features/review` — feature-domain structure
- review workspace: 3-column layout (sidebar / list / detail)
- all filter/sort queries go to backend; no client-side filtering of list data

### Telegram bot
- Kotlin thin adapter, Telegram long polling
- forwards text/voice messages to backend ingest endpoint
- polls backend for failure notifications, delivers to chat, acknowledges

## Architectural priorities

- backend must stay client-agnostic
- Telegram must stay thin
- review-first trust model must remain visible everywhere
- original AI output and latest human-approved values must remain separately visible
- category model must stay exactly 3 levels in V1
- direct item edits must not bypass review semantics (PATCH is approved-only)
- simplicity > flexibility theater
- requirements > stale comments
- Vault runtime truth > source-repo guesses

## Item data model key fields

Each `MemoraItem` has two separate value sets:
- **Original AI output**: `aiTitle`, `aiCleanedText`, `aiType`, `aiCategoryPath`, `aiPriority`
- **Latest human-facing values**: `title`, `cleanedText`, `type`, `categoryPath`, `priority`

Both are always visible in the frontend ItemDetailPanel.

The `telegramTrace` field holds Telegram metadata for traceability (present for all ingest items, not just voice).
