# Env and Runtime Reference

## Important boundary

This file is intentionally about **source-repo working boundaries**, not full production runtime truth.

For production/deployment/runtime truth, use Vault.

## Backend config keys

Spring Boot config via `application.yml` with env var overrides:

| Env var | application.yml key | Default | Notes |
|---------|-------------------|---------|-------|
| `BACKEND_ALLOWED_ORIGIN` | `memora.allowed-origin` | `http://localhost:5173` | CORS origin |
| `BACKEND_APP_PASSWORD_HASH` | `memora.app-password-hash` | bcrypt hash | bcrypt hash of app password |
| `BACKEND_SESSION_DAYS` | `memora.session-days` | `30` | session lifetime |
| `BACKEND_BOT_INGEST_TOKEN` | `memora.bot-ingest-token` | `change-me` | `X-Memora-Bot-Token` value |
| `MEMORA_OWNER_TELEGRAM_USER_ID` | `memora.owner-telegram-user-id` | placeholder | String; compared to `telegramUserId` in ingest request |
| `DEFAULT_CATEGORY_PATH` | `memora.default-category-path` | `Default/General/Inbox` | format: `L1/L2/L3` |
| `MEMORA_TRANSCRIPTION_AUTO_RETRY_ATTEMPTS` | `memora.transcription-auto-retry-attempts` | `3` | voice transcription retries |
| `MEMORA_AI_AUTO_RETRY_ATTEMPTS` | `memora.ai-auto-retry-attempts` | `2` | AI processing retries |
| `MONGODB_URI` | `spring.data.mongodb.uri` | `mongodb://localhost:27017/memora` | Mongo connection |
| `BACKEND_PORT` | `server.port` | `8080` | |

## Backend validation commands

```
cd backend && ./gradlew compileKotlin
cd backend && ./gradlew test
```

## Frontend config keys

Set in `.env` or `.env.local`:
- `VITE_API_BASE_URL` — backend base URL (e.g. `http://localhost:8080`)

Frontend validation:
```
cd frontend && npm run build
```

## Telegram bot config keys (all from env vars)

| Env var | Notes |
|---------|-------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token |
| `BACKEND_BASE_URL` | backend URL without trailing slash |
| `BACKEND_BOT_INGEST_TOKEN` | must match `BACKEND_BOT_INGEST_TOKEN` on backend |
| `OWNER_TELEGRAM_USER_ID` | parsed as Long; must match the String value on backend |
| `BACKEND_TELEGRAM_INGEST_PATH` | default: `/api/capture/telegram/ingest` |
| `BACKEND_FAILURE_NOTIFICATIONS_PATH` | default: `/api/capture/telegram/failure-notifications` |
| `BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE` | default: `/api/capture/telegram/failure-notifications/%s/delivered` |
| `FAILURE_POLL_INTERVAL_SECONDS` | default: `5` |

## Production/deployment truth lives in Vault

Use:
- `Vault/apps/memora/README.md`
- `Vault/apps/memora/AI_AGENT_GUIDE.md`
- `Vault/apps/memora/PORTS_AND_RUNTIME.md`
- `Vault/apps/memora/ENV_CONTRACT.md`

## Hard rule

Do not turn Memora source docs into guessed deployment documentation.
