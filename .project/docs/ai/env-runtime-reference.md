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
| `MEMORA_OWNER_TELEGRAM_USER_ID` | `memora.owner-telegram-user-id` | placeholder | String; compared to `telegramUserId` in ingest request; blank config rejects ingest |
| `DEFAULT_CATEGORY_PATH` | `memora.default-category-path` | `Default/General` | format: `L1/L2` (legacy `L1/L2/L3` tolerated with level 3 ignored) |
| `MEMORA_TELEGRAM_BOT_TOKEN` | `memora.telegram-bot-token` | — | Required for voice download from Telegram; validated non-blank in transcription service |
| `MEMORA_TELEGRAM_API_BASE_URL` | `memora.telegram-api-base-url` | `https://api.telegram.org` | Telegram API base |
| `MEMORA_STORAGE_MODE` | `memora.storage.mode` | `mongo` | Storage backend; `mongo` is default, `in-memory` is for tests/local only |
| `MEMORA_TRANSCRIPTION_AUTO_RETRY_ATTEMPTS` | `memora.transcription-auto-retry-attempts` | `3` | voice transcription retries |
| `MEMORA_AI_AUTO_RETRY_ATTEMPTS` | `memora.ai-auto-retry-attempts` | `2` | AI processing retries |
| `MONGODB_URI` | resolved via `${MONGODB_URI}` in `spring.mongodb.uri` | `mongodb://localhost:27017/memora` | Mongo connection — **Spring Boot 4**: `spring.data.mongodb.uri` is error-level deprecated and ignored; use `spring.mongodb.uri` or `SPRING_MONGODB_URI` env var |
| `BACKEND_PORT` | `server.port` | `8080` | |
| `MEMORA_TRANSCRIPTION_API_BASE_URL` | `memora.transcription-api-base-url` | `https://api.openai.com` | Prod: `http://whisper-worker:8000` (self-hosted) |
| `MEMORA_TRANSCRIPTION_API_KEY` | `memora.transcription-api-key` | — | Prod: `placeholder`; whisper does not validate |
| `MEMORA_TRANSCRIPTION_MODEL` | `memora.transcription-model` | `gpt-4o-mini-transcribe` | Prod: `Systran/faster-whisper-base` |
| `MEMORA_TRANSCRIPTION_LANGUAGE` | `memora.transcription-language` | — | Optional ISO-639-1 language hint |
| `MEMORA_TRANSCRIPTION_TIMEOUT_SECONDS` | `memora.transcription-timeout-seconds` | `120` | HTTP timeout for transcription calls |
| `MEMORA_AI_MODE` | `memora.ai-mode` | `deterministic` | `openai` is required for real V1 AI polishing; deterministic is local/dev/test fallback only |
| `MEMORA_AI_API_KEY` | `memora.ai-api-key` | — | Required when `MEMORA_AI_MODE=openai`; production validation requires non-blank |
| `MEMORA_AI_API_BASE_URL` | `memora.ai-api-base-url` | `https://api.openai.com` | Required and validated non-blank when production validation is enabled |
| `MEMORA_AI_MODEL` | `memora.ai-model` | `gpt-4o-mini` | Required and validated non-blank when production validation is enabled |
| `MEMORA_AI_TIMEOUT_SECONDS` | `memora.ai-timeout-seconds` | `60` | HTTP timeout for AI text calls |
| `MEMORA_AI_FALLBACK_TO_DETERMINISTIC` | `memora.ai-fallback-to-deterministic` | `true` | Local/dev-only escape hatch; production validation requires `false` |
| `MEMORA_VALIDATE_PRODUCTION_CONFIG` | `memora.validate-production-config` | `false` | Set `true` in production-like runtime to fail fast on unsafe AI/auth/bot config |

Production-like AI safety:
- real V1 product behavior requires `MEMORA_AI_MODE=openai`
- production-like runtime should set `MEMORA_VALIDATE_PRODUCTION_CONFIG=true`
- production-like runtime should set `MEMORA_AI_FALLBACK_TO_DETERMINISTIC=false`
- when production validation is enabled, startup fails unless AI mode is `openai`, `MEMORA_AI_API_KEY` is non-blank, `MEMORA_AI_API_BASE_URL` is non-blank, `MEMORA_AI_MODEL` is non-blank, and deterministic AI fallback is disabled
- missing or broken real AI must become visible startup/configuration failure, not fake success
- the same validator also activates for Spring `prod` / `production` profiles

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
cd frontend && npm install
cd frontend && npm run build
cd frontend && npm run test:run
```

Docker/static serving notes:
- `VITE_API_BASE_URL` is resolved at Vite build time.
- `frontend/Dockerfile` should keep using `npm ci` for reproducible image builds.
- `frontend/nginx.conf` should keep SPA fallback to `index.html`.
- Production/local frontend runtime wiring belongs in Vault, especially `apps/memora/frontend/`.

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
| `BACKEND_TIMEOUT_SECONDS` | default: `10`; minimum `1`; used for Java HttpClient connect timeout and each backend request timeout |

Bot env validation:
- `TELEGRAM_BOT_TOKEN` must be present and not an obvious placeholder.
- `BACKEND_BASE_URL` defaults to `http://localhost:8080`, trims trailing slash, and must be a valid `http` or `https` URI.
- `BACKEND_BOT_INGEST_TOKEN` must be present and non-blank.
- `OWNER_TELEGRAM_USER_ID` must parse as a positive Long.
- `FAILURE_POLL_INTERVAL_SECONDS` and `BACKEND_TIMEOUT_SECONDS` must be at least 1.
- Do not put real Telegram tokens or shared bot tokens in docs, examples, commits, or command output.

## Production/deployment truth lives in Vault

Use:
- `Vault/apps/memora/README.md`
- `Vault/apps/memora/AI_AGENT_GUIDE.md`
- `Vault/apps/memora/PORTS_AND_RUNTIME.md`
- `Vault/apps/memora/ENV_CONTRACT.md`
- `Vault/apps/whisper/ENV_CONTRACT.md` — whisper service config (model, compute type, ports)

## Hard rule

Do not turn Memora source docs into guessed deployment documentation.
