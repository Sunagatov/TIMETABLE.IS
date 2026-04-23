# Claude CLI entrypoint for Memora

Start with `AGENTS.md`.

Do not begin with a whole-repo scan.

## Default loading sequence

### If the task is broad or unclear

1. `AGENTS.md`
2. `.claude/generated/request-routing.md`
3. `docs/requirements/README.md`

### Then route by scope

- backend task -> `backend/AGENTS.md`
- frontend task -> `frontend/AGENTS.md`
- telegram-bot task -> `telegram-bot/AGENTS.md`
- product/behavior question -> `docs/requirements/`
- architecture question -> `docs/ai/architecture.md`
- repo shape/orientation -> `docs/ai/repo-map.md`
- token discipline / reading discipline -> `docs/ai/token-budget-rules.md`
- invariant-sensitive change -> `docs/ai/invariants.md`
- implementation sequencing -> `docs/ai/implementation-sequence.md`
- env/runtime/prod-boundary question -> `docs/ai/env-runtime-reference.md`

## Hard rule

Read only the smallest relevant context.

For most tasks:
- one repo-level file
- one scoped file
- one or two compact docs
- exact feature files only

## Claude-specific working style for Memora

Prefer:
- exact paths
- contract-aware diffs
- concrete bug/fix statements
- small reversible changes
- token efficiency
- explicit mention of what stays unchanged

Avoid:
- repeating repo-wide summaries
- carrying Lexora assumptions into Memora
- speculative architecture expansion
- touching all three modules for one-sided work
- inventing deployment behavior that actually lives in Vault

## Product-specific reminders

- Memora is not Lexora.
- Memora is not Mindraft.
- Telegram is thin.
- Backend is source of truth.
- Approved list is separate from review/failure flows.
- Production/deployment truth is in Vault, not here.

## Good Claude output for Memora usually includes

- exact file(s) to read/change
- the requirement or invariant involved
- what should not be changed accidentally
- the smallest validation to run
- whether Vault docs also need checking
