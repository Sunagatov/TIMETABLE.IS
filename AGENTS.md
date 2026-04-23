# Memora — Agent Instructions

Memora is a private, single-user product repo for capturing thoughts through a Telegram bot, processing them asynchronously, and reviewing/searching them in a web app.

This file is the **primary entrypoint** for Claude CLI and Codex CLI.

## Token discipline

To save time and tokens:

1. Read this file first.
2. Read `CLAUDE.md` or `CODEX.md` only if the current agent needs repo-level mode guidance.
3. Read `.claude/generated/request-routing.md` if the task is still ambiguous.
4. Read only the nearest scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`
5. Read only the exact product docs needed by the task.
6. Read only the exact implementation files directly touched by the task.

Do **not** scan the whole repo by default.

## Repo shape

- `backend/` — source of truth, business rules, persistence, auth/session, item workflow
- `frontend/` — login, Needs Review, Failures, approved items, edit/review UI
- `telegram-bot/` — thin transport adapter that forwards accepted messages to backend
- `docs/` — source of truth for product scope and behavior
- `.claude/generated/` — cheap routing aids for low-token work

## Current V1 boundaries that must stay strict

Do not silently introduce these in V1:

- multi-user support
- signup/user management
- labels
- semantic search
- question-answering flow
- AI-created new categories
- regeneration workflows
- Memora-managed audio storage
- mobile app
- public sharing
- deployment/infrastructure concerns in this repo

## Important invariants

- Telegram is a client adapter, not the place for core business logic.
- Backend must remain reusable by future clients.
- One Telegram message becomes exactly one item in V1.
- Fresh AI-processed items must remain separate from approved items until human review.
- Approved items, review items, and failed items are distinct concepts.
- Type and category are distinct concepts.
- Prefer simple, boring code over broad refactors or abstraction-heavy designs.

## Read only the docs that match the task

Common high-value docs:

- `docs/01_SCOPE_AND_MVP.md`
- `docs/03_FUNCTIONAL_REQUIREMENTS.md`
- `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
- `docs/06_DOMAIN_MODEL.md`
- `docs/07_PROCESSING_PIPELINE.md`
- `docs/08_ERROR_HANDLING_AND_RETRY.md`
- `docs/09_REVIEW_WORKFLOW.md`
- `docs/10_AI_BEHAVIOR_RULES.md`
- `docs/13_ENGINEERING_PRINCIPLES.md`
- `docs/16_IMPLEMENTATION_ORDER.md`

Do not reread the whole docs tree if one or two files are enough.

## Validation rule

After edits, run the **smallest relevant validation first**.

Examples:
- backend-only → targeted backend validation
- frontend-only → targeted frontend validation
- telegram-bot-only → smallest bot validation
- cross-cutting contract change → validate the affected surfaces only

## If docs and code conflict

Product docs win unless the user explicitly changed the requirement later.
