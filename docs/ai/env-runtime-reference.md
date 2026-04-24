# Env and Runtime Reference

## Important boundary

This file is intentionally about **source-repo working boundaries**, not full production runtime truth.

For production/deployment/runtime truth, use Vault.

## Source-repo hints

### Backend
- Kotlin/Spring Boot app
- source of truth
- session-based auth expected by requirements
- current local validation:
  - `cd backend && ./gradlew compileKotlin`
  - `cd backend && ./gradlew test`
- current relevant source-repo backend config keys:
  - `BACKEND_ALLOWED_ORIGIN`
  - `BACKEND_APP_PASSWORD_HASH`
  - `BACKEND_SESSION_DAYS`
  - `BACKEND_BOT_INGEST_TOKEN`
  - `MEMORA_OWNER_TELEGRAM_USER_ID`
  - `DEFAULT_CATEGORY_PATH`
  - `MONGODB_URI`

### Frontend
- React/Vite app
- review/search/edit UI

### Telegram bot
- Kotlin-based thin adapter
- transport-focused
- current relevant source-repo bot config keys:
  - `BACKEND_BASE_URL`
  - `BACKEND_BOT_INGEST_TOKEN`
  - `OWNER_TELEGRAM_USER_ID`
  - `BACKEND_TELEGRAM_INGEST_PATH`
  - `BACKEND_FAILURE_NOTIFICATIONS_PATH`
  - `BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE`
  - `FAILURE_POLL_INTERVAL_SECONDS`

## Production/deployment truth lives in Vault

Use:
- `/Users/zufar/IdeaProjects/Vault`
- `apps/memora/README.md`
- `apps/memora/AI_AGENT_GUIDE.md`
- `apps/memora/PORTS_AND_RUNTIME.md`
- `apps/memora/ENV_CONTRACT.md`

## Hard rule

Do not turn Memora source docs into guessed deployment documentation.
