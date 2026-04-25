# Request routing — Memora

Use this file before scanning the repository.

## Core rule

Start from the narrowest likely scope.

Do not do a whole-repo scan first.

## If the task is backend-only

Read:

1. `backend/AGENTS.md`
2. exact relevant requirement file(s)
3. `docs/ai/current-bootstrap-state.md` if current backend status matters
4. exact backend source files touched by the change

Skip frontend and telegram-bot unless integration really requires them.

## If the task is frontend-only

Read:

1. `frontend/AGENTS.md`
2. exact relevant requirement file(s)
3. exact frontend source files touched by the change

Skip backend and telegram-bot unless backend contract changes require them.

## If the task is telegram-bot-only

Read:

1. `telegram-bot/AGENTS.md`
2. exact relevant requirement file(s)
3. `docs/ai/api-surface.md` capture section if backend contracts matter
4. exact Kotlin bot source files under `telegram-bot/src/main/kotlin/com/sunagatov/memora/telegrambot/`

Skip backend/frontend internals unless the contract is changing.
Do not add DB, transcription/Whisper, AI/category/review/lifecycle logic, or retry state to the bot.

## If the task is product/behavior clarification

Read:

1. `docs/requirements/README.md`
2. the smallest exact requirement file(s)
3. `docs/ai/invariants.md` if state/contract sensitivity matters

## If the task is architecture-only

Read:

1. `docs/ai/architecture.md`
2. `docs/ai/repo-map.md`
3. `docs/ai/request-routing-guide.md`

## If the task is doc/routing/context optimization

Read:

1. `AGENTS.md`
2. `docs/ai/README.md`
3. `docs/ai/current-bootstrap-state.md`
4. `docs/ai/repo-map.md`
5. exact stale md files only

## If the task is deployment/runtime/prod-related

Read Vault docs first, not Memora source docs.

Start with:
- `apps/memora/README.md`
- `apps/memora/AI_AGENT_GUIDE.md`
- `apps/memora/CHANGE_MAP.md`
- `apps/memora/PORTS_AND_RUNTIME.md`
- `apps/memora/ENV_CONTRACT.md`

## If the task is cross-cutting

Read:

1. `AGENTS.md`
2. all relevant scoped `AGENTS.md` files
3. exact relevant requirement file(s)
4. only the exact shared docs needed
5. only the exact source files touched

## If the task is still unclear

Route in this order:

1. `AGENTS.md`
2. `docs/requirements/README.md`
3. one scoped `AGENTS.md`
4. one compact doc from `docs/ai/`
5. exact code only after that
