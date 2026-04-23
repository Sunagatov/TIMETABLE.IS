# Repo map (compact)

This is a compact working map of Memora.

It is **not** a full tree dump.

Use it to find likely entry points fast, then open only the files relevant to the task.

---

## Root

Key repo-level files:

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `.claude/generated/request-routing.md`

Main project areas:

- `backend/`
- `frontend/`
- `docs/ai/`

---

## Backend

### Start here for backend changes

- `backend/app/main.py` — app wiring, middleware, mounted routers
- `backend/app/shared/config.py` — settings and env-driven config
- `backend/app/shared/deps.py` — DB session, session auth, CSRF auth, API key auth

### Confirmed feature folders

- `backend/app/features/auth/`
- `backend/app/features/health/`
- `backend/app/features/topics/`
- `backend/app/features/words/`
- `backend/app/features/smart_review/`
- `backend/app/features/trash/`
- `backend/app/features/stats/`

### Representative backend files already known to matter

- `backend/app/features/auth/router.py`
- `backend/app/features/topics/router.py`
- `backend/app/features/words/router.py`
- `backend/app/features/words/suggest_router.py`
- `backend/app/features/words/suggest_service.py`
- `backend/app/features/smart_review/router.py`

### Backend shared concerns

These are the usual places where broad behavior lives:

- settings/env parsing
- auth/session/CSRF dependencies
- DB session wiring
- Alembic/migration integration

---

## Frontend

### Start here for frontend changes

- `frontend/src/main.tsx` — app bootstrap
- `frontend/src/app/router.tsx` — route table
- `frontend/src/shared/http.ts` — shared request helper

### Representative frontend areas known to matter

- login feature
- study page / smart review
- word page
- word edit page
- trash
- stats
- topic tree / navigation components

### Common frontend shared concerns

- shared HTTP transport behavior
- route definitions
- query cache invalidation
- drawer/sidebar state
- pagination/filter URL sync

---

## Docs / AI layer

These files are intentionally compact and should be preferred before broad source scanning:

- `docs/ai/architecture.md`
- `docs/ai/api-surface.md`
- `docs/ai/env-reference.md`
- `docs/ai/context-budget-rules.md`
- `docs/ai/ai-cost-reduction-backlog.md`
- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`

---

## Quick lookup by task

### Login/auth problem
Read:
- `backend/AGENTS.md`
- backend auth router/deps
- `frontend/src/shared/http.ts`
- login feature files

### Topic CRUD problem
Read:
- topics router/service/repository/schema
- relevant topic UI files

### Word CRUD / edit problem
Read:
- words router/service/repository/schema
- word-related frontend API files
- word page / edit page

### Smart review problem
Read:
- smart review backend files
- smart review frontend files
- cache invalidation points if UI freshness is wrong

### AI topic suggestion problem
Read:
- `docs/ai/ai-cost-reduction-backlog.md`
- exact suggestion router/service files

### Topic enrichment / split task
Read:
- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`
- exact curation service/script files

---

## Hard rule

For most tasks, you should not need more than:

- 1 repo-level file
- 1 scoped file
- 3–8 source files
- 1–3 shared helper/config files

If you go much wider, justify it first.
