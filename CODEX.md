# CODEX.md

## Codex Adapter

Read `AGENTS.md` first. This file is Codex-specific workflow only; detailed Memora facts live in `.project/docs/ai/*`.

## Workflow

1. Use `.project/docs/ai/request-routing-guide.md` before broad scans.
2. Read the smallest relevant canonical docs and scoped `AGENTS.md` file.
3. For source-level config/runtime questions, read `.project/docs/ai/env-runtime-reference.md`.
4. For change-impact questions, read `.project/docs/ai/change-guide.md`.
5. For broad frontend work, read `.project/docs/ai/frontend-v1-mvp.md` before scanning source.
6. If the bug smells like shell/env/bootstrap drift, check `.project/docs/ai/env-runtime-reference.md` and Vault task docs before touching source logic.
7. Make focused changes only.
8. Do not move runtime/deployment truth from Vault into Memora.
9. Preserve contracts documented in `.project/docs/ai/api-surface.md` and `.project/docs/ai/invariants.md`.

## Validation Habit

When finishing work, report:
- files changed
- stale files deleted or neutralized, when relevant
- tests or commands run
- commands not run and why

Do not duplicate long current-state facts here. Update `.project/docs/ai/*` instead when behavior, contracts, routing, or repo structure changes.
There is no root `scripts/ai/check-ai-docs.sh` wrapper. Use `bash .project/scripts/ai/check-ai-docs.sh`.
Run `bash .project/scripts/ai/check-ai-docs.sh` after canonical doc or adapter changes.

Common routing reminder:
- local backend login/task issues are often env-loading or cookie-secure problems, not business-logic bugs
- direct source `./gradlew bootRun` does not auto-load `backend/.env.local`
