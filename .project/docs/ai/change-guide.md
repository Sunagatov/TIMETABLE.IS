# Change Guide

This is the canonical "if you change X, also update/check Y" checklist for active AI-agent maintenance.

Ownership boundaries:
- `.project/docs/ai/api-surface.md` owns endpoint/API contract truth.
- `.project/docs/ai/invariants.md` owns non-negotiable behavior.
- `.project/docs/ai/current-state.md` owns current implementation reality.
- this file owns change-impact checklists.

## If you change backend API

Also review:
- `.project/docs/ai/api-surface.md`
- `.project/docs/ai/current-state.md`
- `.project/docs/ai/frontend-v1-mvp.md` when frontend contract usage changes
- frontend API client usage (`frontend/src/features/review/api/reviewApi.ts`)
- telegram-bot backend forwarder (`telegram-bot/src/main/kotlin/.../backend/BackendClient.kt`)
- relevant requirements docs

## If you change frontend auth/session behavior

Also review:
- `.project/docs/ai/frontend-v1-mvp.md` (auth flow and HTTP client sections)
- `.project/docs/ai/api-surface.md` (authentication section)
- `.project/docs/ai/invariants.md` (frontend invariants)
- `frontend/src/app/App.tsx`
- `frontend/src/features/auth/api/authApi.ts`
- `frontend/src/features/auth/hooks/useSessionBootstrap.ts`
- `frontend/src/features/auth/components/LoginForm.tsx`
- `frontend/src/shared/api/httpClient.ts`

Keep these facts stable:
- backend-managed session cookie
- `credentials: "include"` on API calls
- no token in browser storage
- 401 returns to login
- logout clears local authenticated UI even if the logout request fails

Frontend validation:
- `cd frontend && npm run build`
- `cd frontend && npm run test:run`

## If you change frontend review workspace behavior

Also review:
- `.project/docs/ai/frontend-v1-mvp.md` (review workspace state rules)
- `.project/docs/ai/api-surface.md` (Review, Items, Search/filter/sort)
- `.project/docs/ai/invariants.md`
- `frontend/src/features/review/pages/ReviewWorkspacePage.tsx`
- `frontend/src/features/review/hooks/useReviewWorkspaceState.ts`
- `frontend/src/features/review/hooks/useReviewQueries.ts`
- `frontend/src/features/review/hooks/useReviewActions.ts`
- `frontend/src/features/review/api/reviewApi.ts`

Keep these facts stable:
- Needs Review is default authenticated landing
- Needs Review, Failures, and Approved have separate filters
- Approved list stays approved-only by default
- item actions invalidate/refetch backend data instead of faking local state
- selected item updates when the active list changes

## If you change frontend item detail or editing

Also review:
- `.project/docs/ai/frontend-v1-mvp.md` (item detail and editing section)
- `.project/docs/ai/api-surface.md` (Items and Review sections)
- `frontend/src/features/review/components/item-detail/`
- `frontend/src/features/review/types/reviewTypes.ts`

Keep these facts stable:
- current human-facing values and original AI values are both visible
- reviewable edits use `edit-and-approve`
- approved edits use `PATCH /api/items/{itemId}`
- failures do not show invalid approve/edit actions
- `GENERATED` and `EDITED` answer statuses require non-blank answer text
- `NONE`, `REJECTED`, and `DELETED` do not send answer text
- category refetches must not wipe unsaved edits while edit mode is open

## If you change frontend categories

Also review:
- `.project/docs/ai/frontend-v1-mvp.md` (category UI rules)
- `.project/docs/ai/api-surface.md` (Category management)
- `.project/docs/ai/invariants.md` (category invariants)
- `frontend/src/features/review/components/CategoryTree.tsx`
- `frontend/src/features/review/components/sidebar/CategoryManager.tsx`
- `frontend/src/features/review/components/FilterControls.tsx`
- `frontend/src/features/review/hooks/useReviewWorkspaceState.ts`

Keep these facts stable:
- exactly 2 levels, all non-blank for create/update paths
- category and subcategory clicks can filter the active view
- rename updates active category filter when needed
- delete clears active category filter when needed
- backend category errors are visible to the user

## If you change item lifecycle or statuses

Also review:
- `.project/docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `.project/docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `.project/docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `.project/docs/ai/invariants.md` (state transition guards section)
- `backend/src/main/kotlin/.../item/model/ItemEnums.kt`
- `backend/src/main/kotlin/.../review/application/ReviewService.kt`
- `backend/src/main/kotlin/.../item/application/ItemService.kt`
- frontend status handling in `ItemDetailPanel.tsx` (action buttons per view)
- bot failure messaging (which statuses trigger failure notifications)
- `.project/docs/ai/current-state.md`
- `FoundationServicesTests.kt` — update state-guard tests

## If you change filter/query params

This is a high-risk area — param name mismatches are silently ignored by the backend.

Also review:
- `.project/docs/ai/api-surface.md` (search/filter/sort table)
- `.project/docs/ai/frontend-v1-mvp.md` (list query contracts)
- `backend/src/main/kotlin/.../item/api/ItemDtos.kt` (ItemListQueryRequest)
- `frontend/src/features/review/types/reviewTypes.ts` (ListParams, filter types)
- `frontend/src/features/review/api/reviewApi.ts` (buildQuery)
- `frontend/src/features/review/pages/ReviewWorkspacePage.tsx` (toListParams, DEFAULT filters)
- all three filter bar components (NeedsReviewFiltersBar, FailuresFiltersBar, ApprovedFiltersBar)

Known past bug: frontend used `dateFrom`/`dateTo` while backend used `createdFrom`/`createdTo`. Fixed. Do not reintroduce.

## If you change category behavior

Also review:
- `.project/docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `.project/docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `.project/docs/ai/invariants.md` (category invariants section)
- `backend/src/main/kotlin/.../category/` (CategoryService especially)
- `backend/src/main/kotlin/.../item/` (category field in MemoraItem)
- `.project/docs/ai/api-surface.md`
- `frontend/src/features/review/components/CategoryTree.tsx`
- `frontend/src/features/review/components/ReviewSidebar.tsx`
- `frontend/src/features/review/components/FilterControls.tsx` (CategoryCascade)

## If you change auth/session or config keys

Also review:
- `.project/docs/requirements/07_SECURITY_AND_ACCESS.md`
- `backend/AGENTS.md`
- `backend/src/main/resources/application.yml`
- backend auth package (`backend/src/main/kotlin/com/sunagatov/memora/backend/auth/`)
- `.project/docs/ai/env-runtime-reference.md`
- `.project/docs/ai/api-surface.md` if a contract is renamed

If AI mode or AI provider config changes, also review:
- `backend/src/main/kotlin/com/sunagatov/memora/backend/config/ProductionConfigValidator.kt`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/ai/OpenAiCompatibleMemoraAiPort.kt`
- `.project/docs/ai/invariants.md`

Keep these facts stable:
- deterministic AI is local/dev/test fallback only
- real V1 polishing requires `MEMORA_AI_MODE=openai`
- production-like runtime should enable `MEMORA_VALIDATE_PRODUCTION_CONFIG=true`
- production-like runtime should keep `MEMORA_AI_FALLBACK_TO_DETERMINISTIC=false`
- unsafe production-like AI config should fail visibly, not fake success through silent deterministic fallback

## If you change the Telegram bot

Also review:
- `.project/docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `.project/docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `.project/docs/requirements/09_CLIENT_AND_API_BOUNDARIES.md`
- `telegram-bot/AGENTS.md`
- `telegram-bot/README.md`
- `.project/docs/ai/api-surface.md` (capture endpoints section)
- Failure notification payload format — `notificationId` is re-derived each poll; ack is one-shot

Keep these bot facts stable:
- thin adapter only; no backend business logic, no DB writes, no transcription/Whisper/AI calls, no category/review/item lifecycle logic, no retry state
- `/start` and `/help` are local commands and must not be ingested
- unsupported owner messages receive supported-input guidance; unauthorized users receive no reply
- `BACKEND_TIMEOUT_SECONDS` applies to connect timeout and each backend request timeout
- failure notification parsing accepts raw arrays and `{ "notifications": [...] }`
- acknowledgement IDs are URL-encoded path segments
- backend-down polling logs first failure with exception, repeated failures concisely, and recovery once
- do not print or document real Telegram tokens or bot shared tokens

Bot validation:
- `cd telegram-bot && ./gradlew clean test`
- `cd telegram-bot && ./gradlew installDist` when startup/distribution behavior changed
- from repo root, use `./telegram-bot/gradlew -p telegram-bot clean test` because there is no root Gradle wrapper

## If you change failure notifications

Also review:
- `.project/docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `backend/AGENTS.md` (failure notification contract section)
- `backend/src/main/kotlin/com/sunagatov/memora/backend/capture/application/TelegramFailureNotificationService.kt`
- backend failure notification store implementations under `backend/src/main/kotlin/com/sunagatov/memora/backend/capture/store/`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/bot/MemoraLongPollingBot.kt`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/ingest/TelegramIngestRequest.kt`

Keep these facts stable:
- `notificationId` is `"${item.id}:${item.updatedAt.epochSecond}"` — re-derived each poll, not stored as a source field on the item.
- delivery acknowledgement state is backend-owned.
- Mongo-backed failure-notification delivery storage is the normal/prod default.
- in-memory failure-notification delivery storage exists only with `MEMORA_STORAGE_MODE=in-memory`, mainly for tests/local.
- the bot must not keep delivery or retry state locally.
- the bot acknowledges only after successful Telegram send.
- the bot URL-encodes `notificationId` before placing it in the acknowledgement path.

## If you change stack/tooling versions

Also review:
- `.project/docs/requirements/` tech stack files
- root `README.md`
- subproject READMEs

## If you change voice transcription (client side)

Also review:
- `backend/src/main/kotlin/.../transcription/` (all 5 files)
- `backend/src/main/resources/application.yml` — `memora.transcription-*` keys
- `.project/docs/ai/env-runtime-reference.md` (transcription env vars table)
- `Vault/apps/memora/backend/.env.prod` — `MEMORA_TRANSCRIPTION_API_BASE_URL`, `MEMORA_TRANSCRIPTION_MODEL`
- `Vault/apps/whisper/` — if changing whisper deployment itself

Key facts:
- `OpenAiAudioTranscriptionClient` posts to `${transcriptionApiBaseUrl}/v1/audio/transcriptions`
- multipart fields: `model`, `language` (optional, omitted if blank), `response_format=text`, `file`
- prod base URL: `http://whisper-worker:8000`; API key: `placeholder` (whisper doesn't validate)
- model: `Systran/faster-whisper-base` (downloaded on first request from HuggingFace)
- `MEMORA_TRANSCRIPTION_API_KEY` must be non-blank — code throws if blank (even though whisper ignores it)

## If you clean up hardcoded values

Also review:
- `.project/docs/ai/repo-map.md`
- the exact module `AGENTS.md`

Prefer these existing owners before adding new constants:
- backend capture paths/header → `backend/src/main/kotlin/com/sunagatov/memora/backend/capture/api/TelegramCaptureApi.kt`
- frontend review query/filter/api constants → `frontend/src/features/review/reviewConstants.ts`
- bot backend path/header defaults → `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/backend/BotBackendContract.kt`
- bot repeated owner-facing messages → `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/bot/BotMessages.kt`

Do not extract one-off labels, harmless local formatting strings, test data, or CSS classes just to create indirection.

## If you think a change belongs in deployment/runtime

Stop and check Vault first.

## If you add or change tests

- All backend service tests live in `FoundationServicesTests.kt`
- Use `directExecutor()` to make `ItemProcessingService` synchronous
- Use `testProperties()` for consistent config
- Assert state guards throw `IllegalArgumentException` using `assertFailsWith`

## If an IDE reports framework entrypoints as unused

- Spring `@ExceptionHandler` methods are called by the framework and may need narrow `@Suppress("unused")` rather than deletion.
- Prefer the smallest warning fix. Do not change backend business behavior just to silence static analysis.
