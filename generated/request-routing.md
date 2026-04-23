# Lexora request routing

Use this before opening source files.

## Route by task

- Repo overview or quick orientation -> `AGENTS.md`, then this file
- Backend work -> `backend/AGENTS.md`, then the exact backend feature folder
- Frontend work -> `frontend/AGENTS.md`, then the exact feature folder, plus `frontend/src/shared/http.ts` or `frontend/src/shared/routes.ts` only if needed
- AI curation or topic enrichment -> `docs/ai/ai-curation-workflow.md`, `docs/ai/chatgpt-enrich-examples-prompt.txt`, `docs/ai/example-style-guide.md`, then `backend/app/features/words/ai_curation/` and `backend/app/scripts/enrich_examples.py`
- Prompt or context-budget work -> `docs/ai/context-budget-rules.md` and `docs/ai/ai-cost-reduction-backlog.md`
- Word/topic import payloads -> the specific backend feature files being changed, not the whole backend
- Prod deploys, logs, SSH, secrets, or server automation -> Vault repo, not Lexora
- If the user names exact files, read only those files

## Source of truth

- This file is a routing aid only.
- Keep context narrow.
- Prefer one agent file, one routing file, and the exact feature files.
