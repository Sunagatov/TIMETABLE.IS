# Change Guide

## If you change backend API

Also review:
- `docs/ai/api-surface.md`
- `docs/ai/current-bootstrap-state.md`
- frontend API client usage (`frontend/src/features/review/api/reviewApi.ts`)
- telegram-bot backend forwarder (`telegram-bot/src/main/kotlin/.../backend/BackendClient.kt`)
- relevant requirements docs

## If you change item lifecycle or statuses

Also review:
- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `docs/ai/invariants.md` (state transition guards section)
- `backend/src/main/kotlin/.../item/model/ItemEnums.kt`
- `backend/src/main/kotlin/.../review/application/ReviewService.kt`
- `backend/src/main/kotlin/.../item/application/ItemService.kt`
- frontend status handling in `ItemDetailPanel.tsx` (action buttons per view)
- bot failure messaging (which statuses trigger failure notifications)
- `docs/ai/current-bootstrap-state.md`
- `FoundationServicesTests.kt` — update state-guard tests

## If you change filter/query params

This is a high-risk area — param name mismatches are silently ignored by the backend.

Also review:
- `docs/ai/api-surface.md` (search/filter/sort table)
- `backend/src/main/kotlin/.../item/api/ItemDtos.kt` (ItemListQueryRequest)
- `frontend/src/features/review/types/reviewTypes.ts` (ListParams, filter types)
- `frontend/src/features/review/api/reviewApi.ts` (buildQuery)
- `frontend/src/features/review/pages/ReviewWorkspacePage.tsx` (toListParams, DEFAULT filters)
- all three filter bar components (NeedsReviewFiltersBar, FailuresFiltersBar, ApprovedFiltersBar)

Known past bug: frontend used `dateFrom`/`dateTo` while backend used `createdFrom`/`createdTo`. Fixed. Do not reintroduce.

## If you change category behavior

Also review:
- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/ai/invariants.md` (category invariants section)
- `backend/src/main/kotlin/.../category/` (CategoryService especially)
- `backend/src/main/kotlin/.../item/` (category field in MemoraItem)
- `docs/ai/api-surface.md`
- `frontend/src/features/review/components/CategoryTree.tsx`
- `frontend/src/features/review/components/ReviewSidebar.tsx`
- `frontend/src/features/review/components/FilterControls.tsx` (CategoryCascade)

## If you change auth/session or config keys

Also review:
- `docs/requirements/07_SECURITY_AND_ACCESS.md`
- `backend/src/main/resources/application.yml`
- `docs/ai/env-runtime-reference.md`
- `docs/ai/api-surface.md` if a contract is renamed

## If you change the Telegram bot

Also review:
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `telegram-bot/AGENTS.md`
- `docs/ai/api-surface.md` (capture endpoints section)
- Failure notification payload format — `notificationId` is re-derived each poll; ack is one-shot

## If you change stack/tooling versions

Also review:
- `docs/requirements/` tech stack files
- root `README.md`
- subproject READMEs

## If you change voice transcription (client side)

Also review:
- `backend/src/main/kotlin/.../transcription/` (all 5 files)
- `backend/src/main/resources/application.yml` — `memora.transcription-*` keys
- `docs/ai/env-runtime-reference.md` (transcription env vars table)
- `Vault/apps/memora/backend/.env.prod` — `MEMORA_TRANSCRIPTION_API_BASE_URL`, `MEMORA_TRANSCRIPTION_MODEL`
- `Vault/apps/whisper/` — if changing whisper deployment itself

Key facts:
- `OpenAiAudioTranscriptionClient` posts to `${transcriptionApiBaseUrl}/v1/audio/transcriptions`
- multipart fields: `model`, `language` (optional, omitted if blank), `response_format=text`, `file`
- prod base URL: `http://whisper-worker:8000`; API key: `placeholder` (whisper doesn't validate)
- model: `Systran/faster-whisper-base` (downloaded on first request from HuggingFace)
- `MEMORA_TRANSCRIPTION_API_KEY` must be non-blank — code throws if blank (even though whisper ignores it)

## If you think a change belongs in deployment/runtime

Stop and check Vault first.

## If you add or change tests

- All backend service tests live in `FoundationServicesTests.kt`
- Use `directExecutor()` to make `ItemProcessingService` synchronous
- Use `testProperties()` for consistent config
- Assert state guards throw `IllegalArgumentException` using `assertFailsWith`
