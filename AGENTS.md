# AGENTS.md

Canonical lightweight bootloader for Memora agents and maintainers.

## Project Identity

Memora is a private, single-user capture and review system.

This repository is `Sunagatov/Memora`: the application source monorepo for:
- Kotlin/Spring Boot backend
- React/Vite/TypeScript frontend
- Kotlin Telegram bot
- source-level requirements and AI-agent implementation guidance

Runtime, deployment, orchestration, and production operations belong in `Sunagatov/Vault`, especially `apps/memora/` and `apps/whisper/`.

## Hard Boundaries

- Backend is the source of truth.
- Telegram is a thin adapter, not the center of the architecture.
- Deterministic AI is local/dev/test fallback only; real V1 text polishing requires `MEMORA_AI_MODE=openai`.
- Production-like runtime should prefer visible AI failure by enabling `MEMORA_VALIDATE_PRODUCTION_CONFIG=true` and keeping `MEMORA_AI_FALLBACK_TO_DETERMINISTIC=false`.
- Do not add out-of-scope V1 features.
- Do not move Vault runtime/deployment truth into this repo.
- Do not include secrets, tokens, or private credentials in docs, examples, commits, or output.
- Do not rename compatibility/API fields only because they contain legacy wording; API/source changes require a separate explicit task.

## Documentation Source Of Truth

- `AGENTS.md` is only the bootloader.
- `.project/docs/ai/*` owns detailed current implementation facts, contracts, routing, repo map, token discipline, and environment/runtime boundaries.
- `.project/docs/ai/frontend-v1-mvp.md` owns detailed frontend V1 agent guidance.
- `.project/docs/requirements/*` owns product requirements and V1 behavior.
- `backend/AGENTS.md`, `frontend/AGENTS.md`, and `telegram-bot/AGENTS.md` own module-specific rules.
- `CLAUDE.md`, `CODEX.md`, `AMAZONQ.md`, `.claude/*`, and `.amazonq/*` are adapters only.
- Vault owns runtime/deployment/local orchestration truth.
- Never copy long current-state summaries into agent-specific adapters.

## Minimal Read Order

1. `.project/docs/ai/request-routing-guide.md` — choose the smallest context for the task.
2. `.project/docs/ai/current-state.md` — current implementation reality.
3. `.project/docs/ai/api-surface.md` — endpoint contracts, filters, sort, state guards.
4. `.project/docs/ai/invariants.md` — non-negotiable behavior.
5. `.project/docs/ai/frontend-v1-mvp.md` — only for broad frontend work.
6. `.project/docs/ai/env-runtime-reference.md` — only for source-level config and environment questions.
7. `.project/docs/ai/change-guide.md` — only when changing contracts, docs, categories, filters, AI/config, or bot behavior.
8. The smallest exact requirement file(s) under `.project/docs/requirements/`.
9. The relevant scoped guide:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`

Use `.project/docs/ai/README.md` as the AI-docs index.

## Structural Rule

Prefer domain, feature, and area oriented structure.

Examples:
- backend: `auth`, `capture`, `category`, `item`, `review`, `transcription`
- frontend: `features/review`, `features/auth`, `shared/api`, `shared/ui`
- telegram bot: `bot`, `command`, `backend`, `ingest`, `config`

Technical building blocks such as controllers, services, repositories, converters, or DTOs may exist inside a feature package, but should not dominate the root package structure.

## Rules For All Agents

- Keep code boring, explicit, and maintainable.
- Prefer small, vertical changes over broad speculative refactors.
- Backend use cases/services must remain reusable by future non-Telegram clients.
- If requirements and code disagree, requirements win unless the task is explicitly to update requirements.
- If requirements are ambiguous, ask or update docs first instead of inventing behavior.
- Preserve stable V1 contracts documented in `.project/docs/ai/api-surface.md` and `.project/docs/ai/invariants.md`.
- Update high-signal AI docs when concrete behavior, contracts, routing, or repo structure changes.
- Run `bash .project/scripts/ai/check-ai-docs.sh` after documentation architecture or canonical doc changes.
- Do not read archive/stale docs as active context unless the user explicitly asks.
