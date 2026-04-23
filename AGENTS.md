# Memora — Agent Instructions

Memora is a product repo for a private, single-user thought-capture system:
Telegram bot capture → backend processing → web review/search/edit.

This file exists to reduce token waste and keep work predictable for **Claude CLI** and **Codex CLI**.

## Read order for low-token work

1. Read this file first.
2. Read only one of these if needed:
   - `CLAUDE.md`
   - `CODEX.md`
3. Read `.claude/generated/request-routing.md` if it exists.
4. Read only the nearest scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`
5. Read only the exact product docs required by the task.
6. Read only the implementation files directly touched by the task.

Do **not** scan the whole repo by default.

## Repo shape

- `backend/` — source of truth, business logic, persistence, auth/session, review workflow
- `frontend/` — web UI for review/search/edit
- `telegram-bot/` — thin adapter that forwards accepted input to backend
- `docs/` — product and engineering source of truth
- `.claude/generated/` — compact routing aids for token-saving work

## Hard working rules

- Keep Telegram as a client adapter, not a business-logic center.
- Keep backend reusable by future clients.
- Preserve the review-first trust model.
- Preserve V1 boundaries unless the user explicitly changes scope.
- Do not add deployment or infrastructure material here.
- Prefer the smallest correct change over broad refactors.
- Run the **smallest relevant validation** first.
- If docs and code conflict, docs win unless the user explicitly changed the requirement later.

## V1 boundaries to preserve

Do not introduce these by default:

- multi-user support
- labels
- semantic search
- question-answering workflow
- AI-created categories
- regeneration workflows
- Memora-managed audio storage
- mobile app
- public sharing

## How to work efficiently

- For backend-only work: read `backend/AGENTS.md`, then only the target backend files.
- For frontend-only work: read `frontend/AGENTS.md`, then only the target frontend files.
- For bot-only work: read `telegram-bot/AGENTS.md`, then only the target bot files.
- For cross-cutting work: read all three scoped files, then only the exact shared docs needed.

## Default bias

- boring code over clever code
- explicit rules over magic
- small scoped diffs over sweeping rewrites
- continuity for the next AI agent over local optimization for the current one
