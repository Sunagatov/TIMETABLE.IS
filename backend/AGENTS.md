# Backend instructions — Lexora

This file is the scoped operating contract for backend work.

---

## Backend stack

- Python 3.12
- FastAPI
- SQLAlchemy 2
- psycopg 3
- Alembic
- Pydantic 2
- httpx

---

## Read order for backend tasks

### Always start with

- `backend/app/main.py`
- `backend/app/shared/config.py`
- `backend/app/shared/deps.py`

### Then

Read only the exact target feature folder.

Representative feature groups confirmed in current app wiring:

- `auth`
- `health`
- `topics`
- `words`
- `smart_review`
- `trash`
- `stats`

If the task is AI curation or topic enrichment related, read:

- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`
- exact curation files only

---

## Architectural pattern to preserve

Typical backend flow:

1. router handles HTTP concerns and validation boundaries
2. service applies business rules
3. repository/model layer performs DB work
4. schemas shape input/output payloads

Stay consistent with this unless the task proves the pattern is wrong in that area.

---

## Core backend invariants

### Auth and request invariants

- protected API routers use `verify_session` and `verify_csrf`
- session auth is cookie-based
- CSRF token is returned on login
- frontend later sends `X-CSRF-Token`
- bulk import also uses `X-Api-Key`

Do not break this contract casually.

### Data correctness invariants

- deleting a topic must check whether a word still has any **active** topics left
- explicit `null` should be rejected when omission means “leave unchanged”
- workbook/import flows should resolve exported `topic_id` before falling back to topic name
- `example_entries: []` must clear examples rather than silently preserving stale ones
- bulk topic creation/import must remain atomic
- duplicate active topic names are invalid even if slugs differ

### Topic model invariants

- broad umbrella topics may remain in place when adding narrower child topics
- subtopics are ordinary topic rows with `parent_topic_id`
- do not invent parallel hierarchy systems
- keep many-to-many word-topic membership intact

---

## AI topic suggestion path

Current path:

1. load all active topics
2. build prompt including topic list
3. send model call
4. expect exactly one existing topic name
5. validate model output against real topics

This is the highest-ROI AI optimization area.

When changing this flow:

- keep deterministic fallbacks first
- reduce prompt size aggressively
- reduce output tokens aggressively
- cache repeat lookups
- prefer stable IDs or short candidate outputs internally
- add observability if the task justifies it

Read `docs/ai/ai-cost-reduction-backlog.md` before changing this flow.

---

## AI curation / topic split work

Before modifying curation logic, read:

- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`

Durable operational rules:

- export from prod only for prod imports
- use lean exports whenever possible
- `needs_examples_only=true` is the preferred narrow enrichment mode
- 3 strong example sentences per word is the default completion threshold
- broad topics should be split only when boundaries are clearly explainable
- keep umbrella topics when the split is fuzzy
- create new topics before reassigning words
- dry-run before live import
- spot-check before live import when plans are large or newly tuned

---

## Alembic / migration rules

These are important because they have already caused real pain.

- in `alembic/env.py`, `SET LOCAL` statements must be **inside** `with context.begin_transaction()`
- if those statements sit outside the transaction block, SQLAlchemy 2 autobegin can cause migrations to silently no-op
- if Alembic startup fails with duplicate prepared-statement errors, check migration connection settings before retrying deploys blindly
- Docker startup may run migrations on container start, so bad migration behavior is operationally expensive

---

## Prod / Vault workflow

For prod API calls or prod data work:

- use Vault-managed secrets instead of repo-local `.env`
- usual backend secret source is the Vault-managed prod env for Lexora
- typical live API sequence:
  1. call `/auth/login`
  2. extract `csrf_token`
  3. reuse session cookie + `X-CSRF-Token`

For topic rename/split work:

- inspect `/api/topics/audit` and `/api/topics` first
- prefer in-place rename if topic ID stability matters
- split only when the change is structural rather than cosmetic

---

## Change strategy

When touching backend code:

- change as few files as possible
- preserve service/repository split
- avoid “while I’m here” refactors
- prefer bug-specific or contract-specific tests
- avoid mixing AI-path changes with unrelated backend cleanup

---

## Validation

Use the smallest useful validation first.

```bash
cd backend
python -m pytest
ruff check .
```

If the change is feature-local, prefer targeted tests instead of broad scans.
