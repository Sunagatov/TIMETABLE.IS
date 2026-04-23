# CLAUDE.md

## What this repo is

Memora is a product repo, not an ops repo.

It stores:

- backend source
- frontend source
- telegram-bot source
- product and engineering docs
- AI-agent guidance

It does **not** store deployment or infra concerns.

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
- `README.md`
- `docs/01_SCOPE_AND_MVP.md`
- `docs/03_FUNCTIONAL_REQUIREMENTS.md`
- `docs/13_ENGINEERING_PRINCIPLES.md`

### Backend work

- `backend/AGENTS.md`

### Frontend work

- `frontend/AGENTS.md`

### Telegram bot work

- `telegram-bot/AGENTS.md`

## Important repo rules

- preserve backend/client separation
- avoid repo-wide scans unless the task explicitly needs them
- keep diffs small and scoped
- prefer minimal changes over broad refactors
- do not add deployment files here
- keep code and docs aligned

## Validation rule

After edits, run the **smallest matching validation** instead of broad repo-wide checks.
