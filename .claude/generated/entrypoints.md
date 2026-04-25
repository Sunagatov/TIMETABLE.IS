# Entrypoints — Memora

Read these first before opening wider code areas.

## Backend entrypoints

- `backend/build.gradle.kts`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/MemoraBackendApplication.kt`
- `backend/src/main/resources/application.yml`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/health/api/HealthController.kt`

## Frontend entrypoints

- `frontend/package.json`
- `frontend/src/app/main.tsx`
- `frontend/src/app/App.tsx`
- `frontend/src/shared/api/httpClient.ts`

## Telegram bot entrypoints

- `telegram-bot/build.gradle.kts`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/TelegramBotApplication.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/config/BotSettings.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/bot/MemoraLongPollingBot.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/backend/BackendClient.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/ingest/TelegramUpdateMapper.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/command/StartCommandHandler.kt`

## Root agent entrypoints

- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
