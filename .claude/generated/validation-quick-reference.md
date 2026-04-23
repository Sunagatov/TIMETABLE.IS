# Validation quick reference — Memora

Use the smallest relevant validation first.

## Backend-only change

Prefer one of:

- targeted backend test
- narrow startup check
- feature-focused validation

## Frontend-only change

Prefer one of:

- targeted frontend test
- `npm run build`
- route/page-focused validation

## Telegram bot-only change

Prefer one of:

- import/startup check
- narrow bot-side behavior check

## Cross-cutting change

Validate only the touched surfaces first.
Do not jump straight to broad full-project scans unless the task itself is broad.
