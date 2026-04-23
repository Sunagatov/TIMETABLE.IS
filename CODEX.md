# Codex CLI entrypoint for Lexora

Start with `AGENTS.md`.

This file exists to keep Codex work narrow, predictable, and low-token.

---

## Core rule

Do **not** read the entire repository by default.

For most Lexora tasks, the correct sequence is:

1. `AGENTS.md`
2. one scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - or one `docs/ai/*` summary
3. only the exact feature files involved
4. the smallest relevant validation

---

## Fast routing

### Backend change
Read:
- `AGENTS.md`
- `backend/AGENTS.md`
- exact router/service/repository/schema files
- shared config/deps only if required

### Frontend change
Read:
- `AGENTS.md`
- `frontend/AGENTS.md`
- exact page/component/hook/API files
- `frontend/src/shared/http.ts` only if request behavior matters

### AI/topic suggestion change
Read:
- `AGENTS.md`
- `backend/AGENTS.md`
- `docs/ai/ai-cost-reduction-backlog.md`
- `backend/app/features/words/suggest_service.py`

### AI curation / enrichment change
Read:
- `AGENTS.md`
- `backend/AGENTS.md`
- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`
- exact curation files only

### Repo orientation only
Read:
- `docs/ai/repo-map.md`
- `docs/ai/architecture.md`
- `docs/ai/api-surface.md`

---

## What Codex should optimize for in Lexora

- smallest useful diff
- stable contracts preserved
- no speculative abstractions
- no repo-wide scans for small tasks
- no unrelated formatting churn
- deterministic logic before model logic
- clear validation commands

---

## Stable contracts not to break casually

- session-cookie auth
- CSRF flow
- shared frontend HTTP request helper usage
- many-to-many word-topic membership
- topic hierarchy semantics
- import/export payload expectations
- topic delete correctness
- explicit-clear behavior for `example_entries: []`

---

## Validation

### Backend

```bash
cd backend
python -m pytest
ruff check .
```

### Frontend

```bash
cd frontend
npm test
npm run lint
npm run build
```

Use the smallest relevant validation first.

---

## Anti-patterns

Avoid:

- loading backend and frontend together for a one-sided task
- broad “cleanup” refactors during bug fixes
- changing auth/session flow without explicit reason
- reading large docs that are already summarized elsewhere
- assuming prod and local state are interchangeable

---

## Output preference

Prefer output that includes:

- exact file paths
- focused implementation plan
- regression risks
- validation plan
- small, reversible change boundaries
