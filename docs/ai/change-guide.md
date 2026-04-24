# Change Guide

## If you change backend API

Also review:

- frontend API client usage
- telegram-bot backend forwarder
- relevant requirements docs
- `docs/ai/api-surface.md`
- `docs/ai/current-bootstrap-state.md`

## If you change item lifecycle or statuses

Also review:

- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- frontend status handling
- bot failure messaging
- `docs/ai/current-bootstrap-state.md`
- `docs/ai/invariants.md`
- direct item patch approval rules

## If you change category behavior

Also review:

- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/category/*`
- `backend/src/main/kotlin/com/sunagatov/memora/backend/item/*`
- `docs/ai/api-surface.md`
- `docs/ai/current-bootstrap-state.md`

## If you change auth/session or config keys

Also review:

- `docs/requirements/07_SECURITY_AND_ACCESS.md`
- `backend/src/main/resources/application.yml`
- `docs/ai/env-runtime-reference.md`
- telegram-bot/frontend only if external contract changed
- `docs/ai/api-surface.md` if a contract is renamed

## If you change stack/tooling versions

Also review:

- `docs/requirements/08_tech-stack-decision.md`
- root `README.md`
- subproject READMEs

## If you think a change belongs in deployment/runtime

Stop and check Vault first.
