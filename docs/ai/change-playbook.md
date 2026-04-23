# Change Playbook

## If changing backend auth
Read:
- `docs/requirements/02_functional-requirements.md`
- `backend/AGENTS.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/auth/*`

## If changing Telegram ingest
Read:
- `docs/requirements/05_processing-pipeline.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/capture/*`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/ingest/*`
- `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/backend/*`

## If changing review behavior
Read:
- `docs/requirements/06_review-workflow.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/review/*`
- `frontend/src/features/review/*`

## If changing deployment or runtime
Do not start here.
Read Vault docs first:
- `Vault/apps/memora/README.md`
- `Vault/apps/memora/AI_AGENT_GUIDE.md`
- `Vault/apps/memora/CHANGE_MAP.md`
