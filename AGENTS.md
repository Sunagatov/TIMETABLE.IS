# AGENTS.md

This repository is intentionally structured to be easy for:

- Claude CLI
- Codex CLI
- humans maintaining the project later

## Primary goal

Implement **Memora V1 MVP** exactly as defined in `docs/requirements/`, while preserving the current structure and engineering principles.

## Hard boundaries

- This repository owns **application source**, not production deployment files.
- Production/runtime/deployment files live in `Sunagatov/Vault`, especially `apps/memora/`.
- Backend is the source of truth.
- Telegram is an adapter, not the center of the architecture.
- Do not add out-of-scope features.
- Do not over-engineer.

## Structural rule

Prefer **domain / feature / area** oriented structure.

Examples of preferred style:

- backend: `auth`, `capture`, `category`, `item`, `review`
- frontend: `features/review`, `features/auth`, `shared/api`, `shared/ui`
- telegram bot: `bot`, `command`, `backend`, `ingest`

Avoid making the root package structure primarily technical like only:

- `controller`
- `service`
- `repository`
- `dao`
- `converter`

Those technical building blocks may exist **inside a feature package**, but should not dominate the whole project structure.

## Required read order before coding

1. `docs/requirements/README.md`
2. the smallest exact requirement file(s) for the task
3. `docs/ai/README.md`
4. `docs/ai/current-bootstrap-state.md`
5. the smallest relevant subproject guide:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`

For current backend foundation work, the most common requirement files are:

- `docs/requirements/02_DOMAIN_MODEL_AND_STATES.md`
- `docs/requirements/04_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/05_NON_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/07_SECURITY_AND_ACCESS.md`
- `docs/requirements/08_FAILURE_HANDLING_AND_RETRY.md`
- `docs/requirements/09_CLIENT_AND_API_BOUNDARIES.md`
- `docs/requirements/10_VAULT_AND_PRODUCTION_BOUNDARIES.md`

Use the legacy lower-case requirement files only when a task explicitly references them or they still contain detail not yet migrated.

## Rules for all AI agents

- Keep code boring, explicit, and maintainable.
- Prefer small files when practical.
- Avoid giant repo-wide rewrites unless requested.
- Prefer vertical slices over broad speculative refactors.
- Backend use cases/services must remain reusable by future non-Telegram clients.
- If requirements and code disagree, requirements win.
- If requirements are ambiguous, update docs first or ask for a decision instead of inventing behavior.
- Do not move deployment concerns into this repository.
- Prefer updating high-signal AI docs when concrete behavior or routing changed:
  - `docs/ai/current-bootstrap-state.md`
  - `docs/ai/api-surface.md`
  - `docs/ai/repo-map.md`
  - `docs/ai/change-playbook.md`
