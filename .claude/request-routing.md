# Lexora request routing

Use this file before opening source code.

Its purpose is simple: route the task to the **smallest correct context**.

---

## Main routing rules

### Repo overview or quick orientation
Read:
- `AGENTS.md`
- this file
- optionally `docs/ai/repo-map.md`

### Backend work
Read:
- `AGENTS.md`
- `backend/AGENTS.md`
- exact backend feature folder only

### Frontend work
Read:
- `AGENTS.md`
- `frontend/AGENTS.md`
- exact frontend feature files only
- `frontend/src/shared/http.ts` only if request behavior matters
- `frontend/src/shared/routes.ts` only if route naming/navigation matters

### AI curation or topic enrichment
Read:
- `AGENTS.md`
- `backend/AGENTS.md`
- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`
- exact curation backend files only

### Prompt / context / cost work
Read:
- `docs/ai/context-budget-rules.md`
- `docs/ai/ai-cost-reduction-backlog.md`

### API question
Read:
- `docs/ai/api-surface.md`
- then exact router/service files only if needed

### Architecture question
Read:
- `docs/ai/architecture.md`
- optionally `docs/ai/repo-map.md`

### Prod deploys, logs, SSH, secrets, server automation
Read:
- Vault repo, not Lexora source tree

### If the user names exact files
Read only those files plus the smallest required contract file.

---

## Default stop condition

Stop opening files once you know:

- the exact entry point
- the exact files to edit
- the stable contract that must remain unchanged
- the smallest validation needed

---

## Hard reminder

This is a routing file only.

It is **not** the source of truth for implementation details.

After routing, use scoped docs and exact source files.
