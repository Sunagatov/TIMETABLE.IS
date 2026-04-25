# Request Routing Guide

## Backend-only task
Read:
1. `backend/AGENTS.md` — state guards, filter params, sort format, category rules, test patterns
2. exact relevant requirement file(s)
3. `.project/docs/ai/current-state.md` if current implementation shape matters
4. `.project/docs/ai/api-surface.md` when changing endpoints, DTOs, or filter params
5. exact backend files

## Frontend-only task
Read:
1. `frontend/AGENTS.md` — component structure, filter param names, patterns
2. `.project/docs/ai/frontend-v1-mvp.md` — detailed frontend V1 behavior, tests, and runtime checklist when the task is broad or touches review/auth/categories
3. exact relevant requirement file(s)
4. exact frontend files

For narrow cosmetic or single-component fixes, read only the scoped section of `.project/docs/ai/frontend-v1-mvp.md` that matches the task.

## Telegram-bot-only task
Read:
1. `telegram-bot/AGENTS.md`
2. exact relevant requirement file(s)
3. `.project/docs/ai/api-surface.md` (capture section) if touching backend contract
4. exact bot files

Do not read backend/frontend internals unless changing a contract. The bot is a Kotlin thin adapter under `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/`.

## Filter/search/sort task (any layer)
Read:
1. `.project/docs/ai/api-surface.md` (search/filter/sort table)
2. `.project/docs/ai/token-budget-rules.md` (known high-risk areas section)
3. `backend/src/main/kotlin/.../item/api/ItemDtos.kt` for backend param names
4. `frontend/src/features/review/types/reviewTypes.ts` for frontend param names
5. `.project/docs/ai/frontend-v1-mvp.md` (list query contracts) if frontend filters are involved

Key: param names must match exactly between frontend and backend. Date params are `createdFrom`/`createdTo`.

## AI mode / production config safety task
Read:
1. `.project/docs/ai/env-runtime-reference.md`
2. `.project/docs/ai/invariants.md`
3. `backend/AGENTS.md`
4. `backend/src/main/resources/application.yml`
5. `backend/src/main/kotlin/.../config/MemoraProperties.kt`
6. `backend/src/main/kotlin/.../config/ProductionConfigValidator.kt`
7. exact AI adapter file under `backend/src/main/kotlin/.../item/ai/`

Key:
- deterministic AI is local/dev/test fallback only
- real V1 polishing requires `MEMORA_AI_MODE=openai`
- production-like runtime should enable `MEMORA_VALIDATE_PRODUCTION_CONFIG=true`
- production-like runtime should keep `MEMORA_AI_FALLBACK_TO_DETERMINISTIC=false`

## Hardcoded values / constants cleanup task
Read:
1. `.project/docs/ai/change-guide.md`
2. `.project/docs/ai/repo-map.md`
3. the smallest module `AGENTS.md`
4. exact owning constant module before extracting anything

Look for these small owners before inventing new constants:
- backend capture API paths/header: `backend/.../capture/api/TelegramCaptureApi.kt`
- frontend review query/filter constants: `frontend/src/features/review/reviewConstants.ts`
- telegram bot backend paths/header defaults: `telegram-bot/.../backend/BotBackendContract.kt`
- telegram bot repeated user-facing messages: `telegram-bot/.../bot/BotMessages.kt`

Do not extract one-off labels or harmless local literals just to create indirection.

## Docs / agent-doc maintenance task
Read:
1. `.project/docs/ai/README.md`
2. `.project/docs/ai/change-guide.md`
3. `.project/docs/ai/repo-map.md`
4. `.project/docs/ai/token-budget-rules.md`
5. the exact adapter or scoped guide you plan to change

Keep canonical facts in `.project/docs/ai/*`, keep adapters thin, and run `bash .project/scripts/ai/check-ai-docs.sh` after the change.

## Frontend auth/review/category/item-detail task
Read:
1. `frontend/AGENTS.md`
2. the matching section of `.project/docs/ai/frontend-v1-mvp.md`
3. `.project/docs/ai/api-surface.md` only if endpoint/payload/query contracts are involved
4. exact frontend source files

Do not read backend internals unless verifying a contract that is not already documented.

## Product/behavior question
Read:
1. `.project/docs/requirements/README.md`
2. exact relevant requirement file(s)

## Architecture question
Read:
1. `.project/docs/ai/architecture.md`
2. `.project/docs/ai/invariants.md`

## Backend foundation / contract question
Read:
1. `backend/AGENTS.md`
2. `.project/docs/ai/current-state.md`
3. `.project/docs/ai/api-surface.md`
4. exact backend files only after that

## State transition question
Read:
1. `.project/docs/ai/invariants.md` (state transition guards section)
2. `backend/AGENTS.md` (state machine section)
3. `backend/src/main/kotlin/.../review/application/ReviewService.kt`
4. `backend/src/main/kotlin/.../item/application/ItemService.kt`

## Test question (backend)
Read:
1. `backend/AGENTS.md` (testing patterns section)
2. `backend/src/test/kotlin/.../FoundationServicesTests.kt`

Use `directExecutor()` for synchronous processing. Use `testProperties()` for consistent config.

## Test question (telegram bot)
Read:
1. `telegram-bot/AGENTS.md`
2. `telegram-bot/src/test/kotlin/com/sunagatov/memora/telegrambot/`
3. exact bot source file under test

Use JUnit 5. Avoid Telegram network calls. Validate with `cd telegram-bot && ./gradlew clean test`.

## Voice transcription task
Read:
1. `backend/src/main/kotlin/.../transcription/` — all 5 files
2. `backend/src/main/resources/application.yml` — `memora.transcription-*` keys
3. `.project/docs/ai/change-guide.md` (transcription section)

For production config or model changes: stop and go to Vault (`apps/whisper/`, `apps/memora/backend/.env.prod`).

## Deployment/runtime/prod question
Read Vault docs first:
- `Vault/apps/memora/AI_AGENT_GUIDE.md`
- `Vault/apps/whisper/AI_AGENT_GUIDE.md` (for transcription service)

## Unclear task
Start narrow:
1. `AGENTS.md`
2. `.project/docs/ai/repo-map.md`
3. `.project/docs/ai/current-state.md`
4. `.project/docs/ai/api-surface.md`
5. one scoped file
6. exact code only after that
