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
- `telegram-bot/src/memora_bot/*`

## If changing review behavior
Read:
- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/review/*`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/*`

## If changing category behavior
Read:
- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/category/*`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/*`

## If changing deployment or runtime
Do not start here.
Read Vault docs first:
- `Vault/apps/memora/README.md`
- `Vault/apps/memora/AI_AGENT_GUIDE.md`
- `Vault/apps/memora/CHANGE_MAP.md`
