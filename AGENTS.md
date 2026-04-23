# AGENTS.md

This repository is intentionally structured to be easy for:

- Claude CLI
- Codex CLI
- humans maintaining the project later

## Primary goal

Implement **Memora V1 MVP** exactly as defined in `docs/requirements/`.

## Hard boundaries

- This repository owns **application source**, not production deployment files.
- Production/runtime/deployment files live in `Sunagatov/Vault`, especially `apps/memora/`.
- Backend is the source of truth.
- Telegram is an adapter, not the center of the architecture.
- Do not add out-of-scope features.
- Do not over-engineer.

## Required read order before coding

1. `docs/requirements/README.md`
2. `docs/requirements/02_functional-requirements.md`
3. `docs/requirements/03_non-functional-requirements.md`
4. `docs/requirements/04_domain-model.md`
5. `docs/requirements/05_processing-pipeline.md`
6. `docs/requirements/06_review-workflow.md`
7. `docs/requirements/07_ai-behavior-rules.md`
8. `docs/requirements/08_tech-stack-decision.md`
9. `docs/ai/README.md`
10. the smallest relevant subproject guide:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`

## Rules for all AI agents

- Keep code boring, explicit, and maintainable.
- Prefer small files when practical.
- Avoid giant repo-wide rewrites unless requested.
- Prefer vertical slices over broad speculative refactors.
- Backend use cases/services must remain reusable by future non-Telegram clients.
- If requirements and code disagree, requirements win.
- If requirements are ambiguous, update docs first or ask for a decision instead of inventing behavior.
