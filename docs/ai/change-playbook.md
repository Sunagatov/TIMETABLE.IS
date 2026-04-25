# Change Playbook

## If changing backend auth
Read:
- `docs/requirements/07_SECURITY_AND_ACCESS.md`
- `backend/AGENTS.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/auth/*`
- `backend/src/main/resources/application.yml`

## If changing Telegram ingest
Read:
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/capture/*`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/*`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/ingest/*`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/backend/BackendClient.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/bot/MemoraLongPollingBot.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/command/StartCommandHandler.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/config/BotSettings.kt`
- `docs/ai/api-surface.md` (capture section)

Checks:
- commands `/start` and `/help` remain local-only and are not ingested
- one non-command Telegram text/voice owner message becomes one backend item
- unsupported owner inputs get supported-input guidance; unauthorized users are ignored
- bot stays a thin adapter: no DB, no transcription/Whisper/AI, no category/review/lifecycle logic
- `BACKEND_TIMEOUT_SECONDS` remains wired to Java HttpClient connect timeout and request timeout
- bot tests cover settings parsing/validation, text/voice mapping, command non-ingest, backend token/path requests, and failure-notification parsing

## If changing review behavior or status transitions
Read:
- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/ai/invariants.md` (state transition guards section)
- `backend/AGENTS.md` (state machine section)
- `backend/src/main/kotlin/com/sunagatov/memora/backend/review/*`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/*`
- `docs/ai/api-surface.md` (state guards section)
- `FoundationServicesTests.kt` — update state-guard tests

## If changing filter or sort params
Read:
- `docs/ai/api-surface.md` (search/filter/sort table)
- `docs/ai/token-budget-rules.md` (filter param names section)
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/api/ItemDtos.kt`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/application/ItemQueryService.kt`
- `frontend/src/features/review/types/reviewTypes.ts`
- `frontend/src/features/review/api/reviewApi.ts`
- `frontend/src/features/review/pages/ReviewWorkspacePage.tsx`
- All three filter bars: NeedsReviewFiltersBar, FailuresFiltersBar, ApprovedFiltersBar

Param names must match exactly. Mismatches are silent (backend ignores unknown params).

## If changing category behavior
Read:
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/ai/invariants.md` (category invariants section)
- `backend/src/main/kotlin/com/sunagatov/memora/backend/category/*`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/*`
- `frontend/src/features/review/components/CategoryTree.tsx`
- `frontend/src/features/review/components/ReviewSidebar.tsx`
- `frontend/src/features/review/components/FilterControls.tsx` (CategoryCascade)
- `docs/ai/api-surface.md` (category section)

## If changing failure notifications
Read:
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `backend/AGENTS.md` (failure notification contract section)
- `backend/src/main/kotlin/com/sunagatov/memora/backend/capture/application/TelegramFailureNotificationService.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/bot/MemoraLongPollingBot.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/ingest/TelegramIngestRequest.kt`

Note: `notificationId` is `"${item.id}:${item.updatedAt.epochSecond}"` — re-derived each poll, not stored.
Bot notes:
- keep response parsing compatible with raw arrays and `{ "notifications": [...] }`
- URL-encode `notificationId` before placing it in the acknowledgement path
- avoid polling log spam: first consecutive failure can include the exception, repeats should be concise, recovery should be logged once

## If changing voice transcription integration

Read:
- `backend/src/main/kotlin/.../transcription/application/OpenAiCompatibleVoiceTranscriptionService.kt`
- `backend/src/main/kotlin/.../transcription/infrastructure/OpenAiAudioTranscriptionClient.kt`
- `backend/src/main/kotlin/.../transcription/infrastructure/TelegramVoiceDownloader.kt`
- `backend/src/main/kotlin/.../transcription/infrastructure/TranscriptionAudioPreparer.kt`
- `backend/src/main/resources/application.yml` — `memora.transcription-*` config keys
- `docs/ai/env-runtime-reference.md` — transcription env vars

For runtime/deployment changes (model, URL, whisper service config):
- `Vault/apps/whisper/` — whisper service deployment
- `Vault/apps/memora/backend/.env.prod` — `MEMORA_TRANSCRIPTION_API_BASE_URL`, `MEMORA_TRANSCRIPTION_MODEL`

Notes:
- transcription client validates `MEMORA_TRANSCRIPTION_API_KEY` is non-blank (required; whisper itself doesn't validate it)
- in tests: transcription fails by design (no real whisper endpoint) → `TRANSCRIPTION_FAILED` test assertion remains valid
- in production: success path → `AI_PROCESSED_UNREVIEWED`

## If changing deployment or runtime
Do not start here.
Read Vault docs first:
- `Vault/apps/memora/README.md`
- `Vault/apps/memora/AI_AGENT_GUIDE.md`
- `Vault/apps/memora/CHANGE_MAP.md`
