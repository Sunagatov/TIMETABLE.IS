# Validation quick reference — Memora

Use the smallest relevant validation first.

## Backend-only change

Prefer one of:

- `cd backend && ./gradlew compileKotlin`
- targeted backend test
- `cd backend && ./gradlew test`
- feature-focused validation

## Frontend-only change

Prefer one of:

- targeted frontend test
- `cd frontend && npm run build`
- `cd frontend && npm run test:run`
- route/page-focused validation

## Telegram bot-only change

Prefer one of:

- `cd telegram-bot && ./gradlew clean test`
- `cd telegram-bot && ./gradlew installDist`
- from repo root: `./telegram-bot/gradlew -p telegram-bot clean test`

Note: there is no root `./gradlew`; backend and telegram bot own their wrappers.

## Cross-cutting change

Validate only the touched surfaces first.
Do not jump straight to broad full-project scans unless the task itself is broad.
