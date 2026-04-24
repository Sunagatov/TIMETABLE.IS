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
- `docs/ai/api-surface.md` (capture section)

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

## If changing deployment or runtime
Do not start here.
Read Vault docs first:
- `Vault/apps/memora/README.md`
- `Vault/apps/memora/AI_AGENT_GUIDE.md`
- `Vault/apps/memora/CHANGE_MAP.md`
