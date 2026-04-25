# CODEX.md

## Codex Adapter

Read `AGENTS.md` first. This file is Codex-specific workflow only; detailed Memora facts live in `docs/ai/*`.

## Workflow

1. Use `docs/ai/request-routing-guide.md` before broad scans.
2. Read the smallest relevant canonical docs and scoped `AGENTS.md` file.
3. Make focused changes only.
4. Do not move runtime/deployment truth from Vault into Memora.
5. Preserve contracts documented in `docs/ai/api-surface.md` and `docs/ai/invariants.md`.

## Validation Habit

When finishing work, report:
- files changed
- stale files deleted or neutralized, when relevant
- tests or commands run
- commands not run and why

Do not duplicate long current-state facts here. Update `docs/ai/*` instead when behavior, contracts, routing, or repo structure changes.
