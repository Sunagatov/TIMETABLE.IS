# AMAZONQ.md

## Amazon Q Adapter

Read `AGENTS.md` first. This file is an Amazon Q entrypoint only; detailed Memora facts live in `.project/docs/ai/*`.

Use `.project/docs/ai/request-routing-guide.md` before opening broad context. Keep always-loaded Amazon Q context small and avoid duplicating implementation state in this file.

Canonical details:
- `.project/docs/ai/current-state.md`
- `.project/docs/ai/api-surface.md`
- `.project/docs/ai/invariants.md`
- `.project/docs/ai/repo-map.md`
- `.project/docs/ai/env-runtime-reference.md` for source-level config questions
- `.project/docs/ai/change-guide.md` for change-impact routing
- `.project/docs/ai/frontend-v1-mvp.md` for broad frontend work
- `.project/docs/ai/token-budget-rules.md`

Runtime and deployment truth belongs in Vault, not Memora.
Local bootstrap/auth/transcription troubleshooting usually routes through `.project/docs/ai/env-runtime-reference.md` first, then Vault task docs if the issue is orchestration rather than source logic.
There is no root `scripts/ai/check-ai-docs.sh` wrapper. Use `bash .project/scripts/ai/check-ai-docs.sh`.
Run `bash .project/scripts/ai/check-ai-docs.sh` after canonical doc or adapter changes.
