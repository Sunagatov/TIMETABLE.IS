# Backend

Backend is Memora's source of truth. Telegram and the frontend are clients of
backend-owned state transitions and business rules.

## Current State

- Kotlin + Spring Boot 4
- MongoDB persistence by default through `spring.mongodb.uri`
- in-memory stores only when `MEMORA_STORAGE_MODE=in-memory`, mainly for tests
- Mongo-backed web sessions by default
- session auth with bcrypt password hash and configurable secure cookie flag
- unified Telegram ingest at `POST /api/capture/telegram/ingest`
- bot-facing failure notification polling and acknowledgement endpoints
- voice transcription through Telegram download, audio preparation, and an
  OpenAI-compatible `/v1/audio/transcriptions` API
- deterministic AI adapter by default, with optional OpenAI-compatible text AI
  mode via `MEMORA_AI_MODE=openai`
- review workflow for Needs Review, Failures, Approved, retry, approve,
  edit-and-approve, reject, trash, and AI regeneration actions
- 3-level category CRUD with rename cascade and non-empty delete protection

## Run Locally

```bash
cd backend
./gradlew bootRun
```

Useful validation:

```bash
cd backend
./gradlew compileKotlin
./gradlew test
./gradlew build
```

For local browser testing over HTTP, set `BACKEND_COOKIE_SECURE=false`.

## Required Runtime Configuration

Core:

- `MONGODB_URI` default `mongodb://localhost:27017/memora`
- `BACKEND_ALLOWED_ORIGIN` default `http://localhost:5173`
- `BACKEND_APP_PASSWORD_HASH` bcrypt hash for web login
- `BACKEND_APP_PASSWORD` optional local plaintext password override; unsafe for
  production and rejected when production validation is enabled
- `BACKEND_SESSION_DAYS` default `30`
- `BACKEND_COOKIE_SECURE` default `true`
- `BACKEND_BOT_INGEST_TOKEN`
- `MEMORA_OWNER_TELEGRAM_USER_ID`
- `DEFAULT_CATEGORY_PATH` default `Default/General/Inbox`

Transcription:

- `MEMORA_TELEGRAM_BOT_TOKEN`
- `MEMORA_TRANSCRIPTION_API_KEY`
- `MEMORA_TRANSCRIPTION_API_BASE_URL` default `https://api.openai.com`
- `MEMORA_TRANSCRIPTION_MODEL` default `gpt-4o-mini-transcribe`
- `MEMORA_TRANSCRIPTION_LANGUAGE` optional
- `MEMORA_TRANSCRIPTION_TIMEOUT_SECONDS` default `120`
- `MEMORA_TRANSCRIPTION_MAX_AUDIO_BYTES` default `26214400`
- `MEMORA_TRANSCRIPTION_MAX_DURATION_SECONDS` default `600`
- `MEMORA_TRANSCRIPTION_AUTO_RETRY_ATTEMPTS` default `3`

AI:

- `MEMORA_AI_MODE` default `deterministic`; set `openai` for real adapter
- `MEMORA_AI_API_KEY` required only for `openai` mode
- `MEMORA_AI_API_BASE_URL` default `https://api.openai.com`
- `MEMORA_AI_MODEL` default `gpt-4o-mini`
- `MEMORA_AI_TIMEOUT_SECONDS` default `60`
- `MEMORA_AI_FALLBACK_TO_DETERMINISTIC` default `true`
- `MEMORA_AI_AUTO_RETRY_ATTEMPTS` default `2`

Production safety:

- `MEMORA_VALIDATE_PRODUCTION_CONFIG=true` or active profile `prod`/`production`
  fail fast on placeholder bot token, default app password hash, plaintext app
  password override, or missing owner Telegram user ID.
