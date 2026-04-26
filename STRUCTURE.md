# STRUCTURE.md

Thin structure pointer for agents that look for a repository structure file first.

Canonical routing and structure live in:
- `AGENTS.md`
- `.project/docs/ai/request-routing-guide.md`
- `.project/docs/ai/repo-map.md`
- `backend/AGENTS.md`
- `frontend/AGENTS.md`
- `telegram-bot/AGENTS.md`

Fast path:
1. Read `AGENTS.md`.
2. Use `.project/docs/ai/request-routing-guide.md` to choose the smallest context.
3. Use `.project/docs/ai/repo-map.md` for exact module and file paths.

High-signal reminders:
- backend is the source of truth
- telegram bot stays thin
- category paths are exactly 2 levels in V1
- deterministic AI is local/dev/test fallback only
- source-level config and local bootstrap caveats live in `.project/docs/ai/env-runtime-reference.md`
- production/deployment/runtime truth belongs in Vault, not Memora
