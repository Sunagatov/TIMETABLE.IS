# Claude CLI entrypoint for Lexora

Start with `AGENTS.md`.

Do not start by scanning the whole repository.

---

## Default loading sequence

### If task is broad or vague

1. `AGENTS.md`
2. `.claude/generated/request-routing.md`

### Then route by task type

- backend task -> `backend/AGENTS.md`
- frontend task -> `frontend/AGENTS.md`
- AI curation or enrichment -> `docs/ai/ai-curation-workflow.md`
- architecture question -> `docs/ai/architecture.md`
- API question -> `docs/ai/api-surface.md`
- token/cost optimisation -> `docs/ai/ai-cost-reduction-backlog.md`
- prompt/context discipline -> `docs/ai/context-budget-rules.md`

---

## Hard rule

Read only the smallest relevant context.

For most tasks, that means:

- one repo-level file
- one scoped file
- only the exact feature files involved
- 1–3 shared files at most if required

---

## Claude-specific working style for Lexora

Prefer:

- exact paths
- focused diffs
- concrete bug/fix statements
- stable contracts preserved
- token efficiency
- minimal file touch surface

Avoid:

- repeating full repository summaries
- speculative large refactors
- scanning unrelated folders
- touching auth/CSRF/session plumbing unless the task requires it
- changing both frontend and backend for a tiny one-sided task

---

## Common task routing shortcuts

### Login/auth issue
Read:
- `backend/AGENTS.md`
- backend auth files
- `frontend/src/shared/http.ts`
- login feature files

### Topic CRUD issue
Read:
- backend topics files
- relevant topic UI files

### Word editing or study issue
Read:
- backend words files
- `frontend/src/features/words/*`
- relevant study page files

### Smart review issue
Read:
- smart review backend files
- smart review frontend files

### AI topic suggestion issue
Read:
- `backend/AGENTS.md`
- `docs/ai/ai-cost-reduction-backlog.md`
- `backend/app/features/words/suggest_service.py`

### Topic enrichment / split work
Read:
- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`
- exact backend curation files only

---

## Output preference

A good Claude response for Lexora usually includes:

- what file(s) matter
- what exact change is proposed
- what contract must stay stable
- what small validation to run
- what regression risk to watch

That is the default expectation.
