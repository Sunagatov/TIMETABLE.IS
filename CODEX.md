# Codex CLI entrypoint for Memora

Start with `AGENTS.md`.

This file exists to keep Codex work narrow, predictable, and low-token.

## Core rule

Do **not** read the entire repository by default.

For most Memora tasks, the correct sequence is:

1. `AGENTS.md`
2. `.claude/generated/request-routing.md` if needed
3. `docs/requirements/README.md`
4. one scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`
5. only the exact source files involved

## Fast routing

### Backend change
Read:
- `AGENTS.md`
- `backend/AGENTS.md`
- exact requirement doc(s)
- exact backend files

### Frontend change
Read:
- `AGENTS.md`
- `frontend/AGENTS.md`
- exact requirement doc(s)
- exact frontend files

### Telegram bot change
Read:
- `AGENTS.md`
- `telegram-bot/AGENTS.md`
- exact requirement doc(s)
- exact bot files

### Product/flow question
Read:
- `docs/requirements/README.md`
- the exact relevant requirement file(s)

### Repo orientation only
Read:
- `docs/ai/repo-map.md`
- `docs/ai/architecture.md`
- `docs/ai/request-routing-guide.md`

### Env/runtime/prod-boundary question
Read:
- `docs/ai/env-runtime-reference.md`
- and Vault docs if the issue is production-facing

## What Codex should optimize for in Memora

- smallest useful diff
- preserve V1 constraints
- preserve backend client-agnostic design
- no speculative abstractions
- no repo-wide scans for small tasks
- no unrelated formatting churn
- explicit respect for KISS and YAGNI

## Stable contracts not to break casually

- single-user V1 assumptions
- review-first trust model
- exact type enum
- exact three-level category model
- Telegram thin-adapter rule
- backend source-of-truth rule
- approved vs unreviewed/failure separation
- no local invention of Vault deployment truth

## Validation mindset

Run the smallest relevant validation first.

### Backend
- targeted Gradle test or build

### Frontend
- targeted build/checks

### Telegram bot
- smallest bot-side validation possible

## Anti-patterns

Avoid:
- loading backend, frontend, and bot for a tiny one-module task
- broad “cleanup” refactors during requirement-driven work
- rewriting contracts before checking `docs/requirements/`
- inventing deployment/runtime assumptions that belong in Vault
- treating stale Lexora wording as truth
