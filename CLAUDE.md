# CLAUDE.md

## What this repo is

Memora is a **product repo**, not an ops repo.

It stores:

- backend source
- frontend source
- telegram-bot source
- product and engineering docs
- AI-agent guidance

It does **not** store deployment or infrastructure concerns.

## Token discipline

To save time and tokens:

- do not scan the whole repo by default
- start from `AGENTS.md`
- then open only the nearest scoped file
- then read only the exact docs needed for the task
- then read only the target implementation files

## First places to look

### Repo-level

- `AGENTS.md`
- `.claude/generated/request-routing.md`
- `.claude/generated/app-surfaces.md`
- `.claude/generated/entrypoints.md`
- `.claude/generated/validation-quick-reference.md`

### Backend work

- `backend/AGENTS.md`

### Frontend work

- `frontend/AGENTS.md`

### Telegram bot work

- `telegram-bot/AGENTS.md`

## Claude-style working rules

- prefer continuity over novelty
- keep diffs small and scoped
- do not widen scope because it seems useful
- keep code and docs aligned
- preserve backend/client separation
- do not add deployment files here
- avoid whole-repo rereads after the first pass

## Validation rule

After edits, run the **smallest matching validation** instead of broad repo-wide checks.

## If the task is ambiguous

Read the narrowest relevant product docs and preserve current repo direction.
Do not invent new product behavior silently.
