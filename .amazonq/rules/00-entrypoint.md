# Amazon Q Entrypoint

Start with `AGENTS.md`, then route through `.project/docs/ai/request-routing-guide.md`.

This rules file must stay small because Amazon Q may load it automatically. Do not duplicate current Memora implementation facts here; use `.project/docs/ai/*` for canonical project knowledge.

Do not read archive/stale docs as active context unless explicitly requested. Do not move Vault runtime/deployment truth into this repository.

For broad frontend work, use `frontend/AGENTS.md` plus `.project/docs/ai/frontend-v1-mvp.md`.
For source-level config questions, use `.project/docs/ai/env-runtime-reference.md`.
For doc/change-impact work, use `.project/docs/ai/change-guide.md`.
