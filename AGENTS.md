# Memora — Agent Instructions

Memora is a private, single-user system for capturing thoughts through a Telegram bot, processing them asynchronously, and reviewing/searching them in a web app.

This repository should stay easy for both **Claude CLI** and **Codex CLI** to continue without rereading unnecessary files.

## Read order for low-token work

1. Read this file.
2. Read `CLAUDE.md` or `CODEX.md` only if the current agent needs extra repo-level guidance.
3. Read `.claude/generated/request-routing.md` if it exists.
4. Read only the nearest scoped file:
   - `backend/AGENTS.md` for backend work
   - `frontend/AGENTS.md` for frontend work
   - `telegram-bot/AGENTS.md` for bot work
5. Read only the exact docs required by the task:
   - `docs/00_PRODUCT_VISION.md`
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
6. Read only the files directly touched by the task.

Do **not** scan the whole repo by default.

## Repo shape

- `backend/` — source of truth, business logic, persistence, auth/session, review workflow
- `frontend/` — web UI for login, review, failures, approved items, search/filter/sort
- `telegram-bot/` — thin adapter that forwards accepted messages to backend
- `docs/` — product/source-of-truth docs
- `.claude/generated/` — compact routing aids to save tokens

## Important rules

- Telegram is a client adapter, not the place for core business logic.
- Keep backend reusable by future clients.
- Preserve the review-first trust model.
- Do not invent V1 features outside the docs.
- Do not add deployment/infrastructure material to this repo.
- Prefer simple, boring code over clever abstractions.
- Run the **smallest relevant validation** first.

## Hard V1 boundaries

Do not add these in V1 unless the user explicitly changes scope:

- multi-user support
- labels
- semantic search
- question-answering workflow
- AI-created new categories
- regeneration workflows
- Memora-managed audio storage
- mobile app
- public sharing

## If docs and code conflict

Docs win unless the user explicitly changed the requirement later.
