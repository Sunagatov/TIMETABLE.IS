# Memora architecture summary

This file is a compact architecture map for agents and humans who need the system shape without reading the whole codebase.

It is intentionally practical, not exhaustive.

---

## Product purpose

Memora is a personal English vocabulary learning app centered on:

- topic-based study
- fast review
- word-level progress tracking
- smart review queues
- quick topic/word management
- AI-assisted enrichment where it provides real value

---

## Runtime shape

### Local development

- Postgres runs in Docker
- backend serves FastAPI on port `8000`
- frontend serves Vite/React on port `5173`

### High-level components

#### Backend
Owns:

- business rules
- persistence
- auth/session logic
- topic and word CRUD
- smart review
- trash and stats
- AI topic suggestion
- AI curation import/export

#### Frontend
Owns:

- login flow
- route-level UX
- study and review UI
- editing screens
- shared HTTP request helper
- query cache coordination

#### Docs/AI layer
Owns:

- compact repo summaries
- routing guidance
- curation workflow instructions
- cost-reduction backlog
- token-budget rules

---

## Backend surface at a glance

The FastAPI application mounts routers for:

- health
- auth
- topics
- words
- word topic suggestion
- smart review
- trash
- stats

Protected functional routers are guarded by:

- session-cookie verification
- CSRF header verification

---

## Frontend surface at a glance

Confirmed routes include:

- `/login`
- `/smart-review`
- `/topics/:topicSlug`
- `/words/:wordId`
- `/words/:wordId/edit`
- `/trash`
- `/stats`

Main frontend architectural patterns:

- shared HTTP helper for request concerns
- feature-local components/hooks where possible
- route-driven screen organization
- React Query for server-state orchestration

---

## Core request flow

### Authenticated request flow

1. user logs in
2. backend returns `csrf_token` and sets session cookie
3. frontend stores CSRF token
4. frontend request helper sends:
   - cookie via `credentials: 'include'`
   - `X-CSRF-Token` when available
5. backend verifies cookie + CSRF before protected routes proceed

This is a stable system contract.

---

## Typical backend request shape

Typical flow:

1. router handles HTTP-level concerns
2. service applies business rules
3. repository / DB model layer performs persistence work
4. schemas shape response payload

Do not collapse these layers casually without a reason.

---

## Word update flow

Typical path:

- frontend feature API or component action
- shared HTTP helper
- FastAPI router
- service/repository logic
- SQLAlchemy session / DB
- response schema back to frontend
- cache invalidation on frontend where required

---

## Smart review flow

Typical path:

- frontend opens smart review screen
- backend returns active queue or regenerates it
- queue item completion updates queue state
- frontend refreshes or updates dependent views

Cache freshness matters here.

---

## AI topic suggestion flow

Current path:

1. frontend sends word + translation
2. backend loads all active topics
3. backend composes a prompt containing the topic list
4. model returns one topic name
5. backend validates that the topic exists
6. backend returns selected topic

This design is simple but grows more expensive as the topic catalog grows.

Read `docs/ai/ai-cost-reduction-backlog.md` before changing this flow.

---

## AI curation flow

Current curation workflow is backend-first and review-safe:

1. export topic words from prod
2. create or refine import payload
3. dry-run import
4. review counts/sample
5. live import only after validation

This path exists specifically to reduce unsafe bulk AI changes.

---

## Key architectural priorities

- keep auth contract stable
- keep backend feature boundaries clear
- keep frontend state flow understandable
- prefer deterministic/cached logic before LLM calls
- keep prompts and payloads compact
- avoid repo-wide refactors unless repeated pain or correctness requires them

---

## Known stress points

These are the places where changes are most likely to create regressions:

- session + CSRF auth plumbing
- topic deletion behavior
- import/export semantics
- `example_entries: []` clearing behavior
- topic hierarchy semantics
- many-to-many topic membership
- cache invalidation across study/smart-review/stats/trash
- Alembic startup / migration transaction behavior
