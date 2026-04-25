# Repo Map

## Root

- `README.md` — high-level project purpose and source/runtime split.
- `AGENTS.md` — canonical lightweight bootloader and source-of-truth policy.
- `CLAUDE.md` — thin Claude adapter.
- `CODEX.md` — thin Codex adapter.
- `AMAZONQ.md` — thin Amazon Q adapter.
- `.claude/request-routing.md` — thin pointer to `docs/ai/request-routing-guide.md`.
- `.amazonq/rules/00-entrypoint.md` — thin Amazon Q always-loaded entrypoint.
- `.env.example` — local source-repo config template only; not production truth.

## Backend

- `backend/AGENTS.md` — read before backend work.
- `backend/README.md`
- `backend/src/main/resources/application.yml` — source-level config defaults.
- `backend/src/main/kotlin/com/sunagatov/memora/backend/`
  - `auth/` — login, logout, session cookie flow, session stores.
  - `capture/` — Telegram ingest, bot auth, failure notification polling/ack services.
  - `category/` — exact 3-level category model, CRUD, store implementations.
  - `common/` — API error response and global exception handler.
  - `config/` — Memora properties, security, async processing, production config validation.
  - `health/` — health endpoint.
  - `item/` — item model, lifecycle, AI ports, processing, query, stores.
  - `review/` — review workflow and state-guarded actions.
  - `transcription/` — voice transcription integration: Telegram download, audio prep, OpenAI-compatible transcription client/service.
- `backend/src/test/kotlin/com/sunagatov/memora/backend/` — backend tests, including service/state-guard coverage.

## Frontend

- `frontend/AGENTS.md` — read before frontend work.
- `frontend/README.md`
- `frontend/src/`
  - `app/` — app root and providers.
  - `features/auth/` — login and session bootstrap.
  - `features/review/` — review workspace, filters, category tree/management, item detail, actions, queries, types.
  - `shared/api/httpClient.ts` — fetch wrapper and unauthorized handling.
  - `shared/config/env.ts` — frontend source-level env mapping.

## Telegram Bot

- `telegram-bot/AGENTS.md` — read before bot work.
- `telegram-bot/README.md`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/`
  - `bot/` — long-polling bot message dispatch and failure notification delivery.
  - `backend/` — backend HTTP client.
  - `command/` — local `/start` and `/help` handling.
  - `config/` — environment-backed bot settings.
  - `ingest/` — Telegram update mapping and backend DTOs.
- `telegram-bot/src/test/kotlin/com/sunagatov/memora/telegrambot/` — focused bot tests.

## Docs

- `docs/requirements/` — product requirements and V1 behavior contracts.
- `docs/ai/` — canonical detailed AI-agent knowledge base.
- `docs/ai/current-state.md` — current implementation reality.
- `docs/ai/api-surface.md` — endpoint contracts, query params, sort, state guards.
- `docs/ai/invariants.md` — durable behavior rules.
- `docs/ai/request-routing-guide.md` — choose minimal context for each task.
- `docs/ai/token-budget-rules.md` — reading discipline and archive/stale-doc rules.
- `docs/ai/env-runtime-reference.md` — source-level config reference; production truth remains Vault.
- `docs/ai/vault-boundary.md` — deployment/runtime boundary.
- `docs/ai/change-guide.md` — change-impact checklist: if you change X, also update/check Y.

## Scripts

- `scripts/ai/check-ai-docs.sh` — drift check for stale terms, active legacy docs, and oversized adapters.

## Runtime / Deployment

Do not treat this repo as the production runtime source of truth.

Vault owns:
- `apps/memora/backend`
- `apps/memora/frontend`
- `apps/memora/telegrambot`
- `apps/whisper`

Read Vault only when the task is explicitly about runtime, deployment, production operations, or local orchestration.

## Ignored / Removed Legacy Context

The old `.important/` context tree and manually maintained `.claude/generated/*` duplicates are not active agent context. They were removed to prevent stale Memora facts from being treated as current guidance.

## Validation Wrappers

- Backend and telegram bot each own their Gradle wrapper.
- There is no root `./gradlew`.
- Frontend uses npm scripts under `frontend/`.
