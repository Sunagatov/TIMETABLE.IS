# Memora request routing

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
- `docs/ai/current-bootstrap-state.md` if contract/bootstrap status matters
- exact backend feature folder only

### Frontend work
Read:
- `AGENTS.md`
- `frontend/AGENTS.md`
- exact frontend feature files only
- `frontend/src/shared/api/httpClient.ts` only if request behavior matters

### Documentation / agent-context enrichment
Read:
- `AGENTS.md`
- `docs/ai/README.md`
- `docs/ai/current-bootstrap-state.md`
- `docs/ai/repo-map.md`
- exact stale doc files only

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
- Vault repo, not Memora source tree

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
