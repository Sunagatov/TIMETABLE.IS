# App Surfaces

## Backend surface

Role:
- source of truth
- business logic
- persistence
- auth/session
- review/failure/approval rules
- category management
- AI orchestration

Initial entrypoints:
- `backend/src/main/kotlin/com/sunagatov/memora/backend/MemoraBackendApplication.kt`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/web/`
- `backend/src/main/resources/application.yml`

## Frontend surface

Role:
- login
- review queues
- approved list
- item details/editing
- search/filter/sort
- category tree/sidebar

Initial entrypoints:
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/pages/NeedsReviewPage.tsx`

## Telegram bot surface

Role:
- receive Telegram updates
- validate sender
- forward to backend
- send ack/failure messages

Initial entrypoints:
- `telegram-bot/src/memora_bot/main.py`
- `telegram-bot/src/memora_bot/config.py`

## Shared source of truth

Behavior comes from:
- `docs/03_FUNCTIONAL_REQUIREMENTS.md`
- `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
- `docs/06_DOMAIN_MODEL.md`
- `docs/07_PROCESSING_PIPELINE.md`
- `docs/08_ERROR_HANDLING_AND_RETRY.md`
- `docs/09_REVIEW_WORKFLOW.md`
- `docs/10_AI_BEHAVIOR_RULES.md`
