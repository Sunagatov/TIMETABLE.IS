# Repo Map

## Root
- `README.md` — repo purpose and boundaries
- `AGENTS.md` — global agent rules
- `CLAUDE.md` — Claude CLI guidance
- `CODEX.md` — Codex CLI guidance
- `.env.example` — local config template

## Backend
- `backend/AGENTS.md` ← read this before any backend task
- `backend/README.md`
- `backend/src/main/resources/application.yml` ← config keys and defaults
- `backend/src/main/kotlin/com/sunagatov/memora/backend/`
  - `auth/` — login, logout, session, session filter
  - `capture/` — Telegram ingest, failure notification controller + service + store
  - `category/` — 3-level category model, service, store
  - `common/` — ApiErrorResponse, GlobalExceptionHandler
  - `config/` — MemoraProperties, SecurityConfig, AsyncProcessingConfig
  - `item/` — MemoraItem model, ItemEnums, ItemService, ItemQueryService, ItemProcessingService, store
  - `review/` — ReviewController, ReviewService
  - `health/` — HealthController
- `backend/src/test/kotlin/com/sunagatov/memora/backend/`
  - `FoundationServicesTests.kt` ← 12 tests covering all state guards and contracts
  - `MemoraBackendApplicationTests.kt` ← Spring context load

## Frontend
- `frontend/AGENTS.md` ← read this before any frontend task
- `frontend/README.md`
- `frontend/src/`
  - `app/App.tsx` — root component, auth routing
  - `app/main.tsx`
  - `app/providers/AppQueryProvider.tsx` — React Query setup
  - `features/auth/`
    - `api/authApi.ts`
    - `components/LoginForm.tsx`
    - `hooks/useSessionBootstrap.ts` — session check on mount
    - `pages/LoginPage.tsx`
  - `features/review/`
    - `api/reviewApi.ts` — all backend calls; `buildQuery()` strips undefined and "ALL"
    - `components/ApprovedFiltersBar.tsx`
    - `components/CategoryTree.tsx` — collapsible 3-level sidebar tree
    - `components/FailuresFiltersBar.tsx`
    - `components/FilterControls.tsx` — FilterSelect, DateField, ResetButton, CategoryCascade
    - `components/ItemDetailPanel.tsx` — AI output vs human-facing comparison + action buttons
    - `components/NeedsReviewFiltersBar.tsx`
    - `components/ReviewQueueList.tsx` — item list with status badges
    - `components/ReviewSidebar.tsx` — nav + tree + category management
    - `hooks/useReviewActions.ts` — all item action handlers + refreshAll()
    - `pages/ReviewWorkspacePage.tsx` — main workspace, filter state, queries
    - `types/reviewTypes.ts` — MemoraItem, MemoraCategory, filter types, ListParams
  - `shared/api/httpClient.ts` — fetch wrapper, UnauthorizedError, memora:unauthorized event
  - `shared/config/env.ts` — VITE_API_BASE_URL

## Telegram bot
- `telegram-bot/AGENTS.md` ← read this before any bot task
- `telegram-bot/README.md`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/`
  - `bot/MemoraLongPollingBot.kt` — message dispatch + failure notification delivery
  - `backend/BackendClient.kt` — HTTP client for backend ingest and notification endpoints
  - `ingest/TelegramUpdateMapper.kt` — Telegram Update → ingest request
  - `ingest/TelegramIngestRequest.kt` — request/response DTOs incl. TelegramFailureNotification
  - `command/StartCommandHandler.kt`
  - `config/BotSettings.kt` — config from environment
  - `TelegramBotApplication.kt`

## Docs
- `docs/requirements/README.md` ← read order for requirements
- `docs/requirements/01_SCOPE_AND_V1_MVP.md`
- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/05_NON_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/07_SECURITY_AND_ACCESS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `docs/requirements/09_CLIENT_AND_API_BOUNDARIES.md`
- `docs/ai/current-bootstrap-state.md` ← always read this first for current reality
- `docs/ai/api-surface.md` ← endpoints, params, state guards
- `docs/ai/invariants.md` ← non-negotiable rules
- `docs/ai/architecture.md` ← tech stack, module responsibilities
- `docs/ai/repo-map.md` ← this file
- `docs/ai/implementation-sequence.md` ← what is done and what is next
- `docs/ai/implementation-order.md` ← short index, prefer implementation-sequence for real picture
- `docs/ai/change-guide.md` ← what else to read/update when changing X
- `docs/ai/change-playbook.md` ← step-by-step checklists per change type
- `docs/ai/request-routing-guide.md` ← what to read for each task type
- `docs/ai/token-budget-rules.md` ← reading discipline
- `docs/ai/env-runtime-reference.md` ← config keys; production truth is in Vault
- `docs/ai/vault-boundary.md` ← deployment boundary rule
