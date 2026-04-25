# CODEX.md

## Codex Adapter

Read `AGENTS.md` first. This file is Codex-specific workflow only; detailed Memora facts live in `.project/docs/ai/*`.

## Workflow

1. Use `.project/docs/ai/request-routing-guide.md` before broad scans.
2. Read the smallest relevant canonical docs and scoped `AGENTS.md` file.
3. For broad frontend work, read `.project/docs/ai/frontend-v1-mvp.md` before scanning source.
4. Make focused changes only.
5. Do not move runtime/deployment truth from Vault into Memora.
6. Preserve contracts documented in `.project/docs/ai/api-surface.md` and `.project/docs/ai/invariants.md`.

## Validation Habit

When finishing work, report:
- files changed
- stale files deleted or neutralized, when relevant
- tests or commands run
- commands not run and why

Do not duplicate long current-state facts here. Update `.project/docs/ai/*` instead when behavior, contracts, routing, or repo structure changes.
