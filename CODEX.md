# CODEX.md

## Codex Adapter

Read `AGENTS.md` first. This file is Codex-specific workflow only; detailed Memora facts live in `.project/docs/ai/*`.

## Workflow

1. Use `.project/docs/ai/request-routing-guide.md` before broad scans.
2. Read the smallest relevant canonical docs and scoped `AGENTS.md` file.
3. For source-level config/runtime questions, read `.project/docs/ai/env-runtime-reference.md`.
4. For change-impact questions, read `.project/docs/ai/change-guide.md`.
5. For broad frontend work, read `.project/docs/ai/frontend-v1-mvp.md` before scanning source.
6. Make focused changes only.
7. Do not move runtime/deployment truth from Vault into Memora.
8. Preserve contracts documented in `.project/docs/ai/api-surface.md` and `.project/docs/ai/invariants.md`.

## Validation Habit

When finishing work, report:
- files changed
- stale files deleted or neutralized, when relevant
- tests or commands run
- commands not run and why

Do not duplicate long current-state facts here. Update `.project/docs/ai/*` instead when behavior, contracts, routing, or repo structure changes.
Run `bash .project/scripts/ai/check-ai-docs.sh` after canonical doc or adapter changes.
