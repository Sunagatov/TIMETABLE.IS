# Lexora — Repository Agent Instructions

This file is the **main operating contract** for coding agents working in Lexora.

If you only read one file before starting, read this one.

---

## What Lexora is

Lexora is a personal English vocabulary learning app with:

- topic-based study
- word and topic CRUD
- smart review queues
- stats and trash flows
- AI-assisted topic suggestion
- AI-assisted curation/import workflows

It is a **monorepo** with backend, frontend, and compact AI/helper docs.

---

## Primary goal of this file

Reduce token usage and reduce accidental repo-wide scanning.

This file tells the agent:

- what to read first
- what not to read by default
- which contracts are stable
- how to keep changes small and safe

---

## Default read order

### Always

1. Read `AGENTS.md`
2. Read `.claude/generated/request-routing.md` if the task is still broad
3. Read the smallest scoped file:
   - backend task -> `backend/AGENTS.md`
   - frontend task -> `frontend/AGENTS.md`
   - AI curation task -> `docs/ai/ai-curation-workflow.md`
   - architecture/API question -> `docs/ai/architecture.md` and `docs/ai/api-surface.md`

### Then

Read only:

- the exact files to change
- at most 1–3 shared helpers if truly needed

### Do not do this by default

- do not scan the entire repository
- do not open both frontend and backend unless the task crosses that boundary
- do not re-read large docs if a compact summary file already answers the question

---

## Project shape

### Root

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `.claude/generated/request-routing.md`
- `backend/`
- `frontend/`
- `docs/ai/`
- `docker-compose.yml` or compose file used by the project

### Backend

FastAPI application with DB/auth/business logic.

Confirmed feature groups:

- `auth`
- `health`
- `topics`
- `words`
- `smart_review`
- `trash`
- `stats`

### Frontend

React application with route-driven study and editing flows.

### Docs

`docs/ai/` contains compressed context specifically meant to save agent tokens.

---

## Hard operating rules

### 1. Narrow context first

Repository context is expensive.  
Assume most tasks need:

- 1 routing file
- 1 scoped agent file
- 3–8 code files
- 0–3 shared helpers

### 2. Minimal diffs first

Prefer the smallest change that solves the real problem.

### 3. Preserve stable contracts

Do not casually change:

- session-cookie auth shape
- CSRF header flow
- shared frontend HTTP helper behavior
- feature boundaries unless justified
- import payload semantics
- many-to-many word-topic behavior
- topic hierarchy semantics

### 4. Prefer deterministic logic before LLM logic

If a problem can be solved with deterministic code, caching, filtering, validation, or shortlisting, do that first.

### 5. Prod work must be evidence-based

If a task touches prod data or prod workflow:

- inspect current prod state first
- use Vault-managed secrets/workflows
- keep changes reversible
- prefer rename-in-place when IDs must stay stable

---

## Stable repo invariants

These are easy to regress and should be treated as durable defaults.

### Auth invariants

- protected routes use **session cookie + CSRF**
- frontend requests should normally go through `frontend/src/shared/http.ts`
- login returns a CSRF token
- protected calls later send `X-CSRF-Token`

### Backend correctness invariants

- deleting a topic must consider remaining **active** topics, not raw counts
- update payloads should reject explicit `null` where omission means “leave unchanged”
- workbook / export-import flows should prefer exported topic IDs over names
- `example_entries: []` means explicit clear
- bulk topic import should stay atomic
- duplicate active topic names are invalid even if slugs differ

### Frontend correctness invariants

- cache invalidation must cover downstream views that depend on changed words/topics
- Smart Review must not show stale counts while shared word data is reloading
- drawer/sidebar state must not leak across route transitions
- pagination and URL must not disagree
- topic hierarchy and many-to-many memberships must remain visible and intact

---

## AI-specific rules

### Topic suggestion

Current suggestion path is a high-value optimization area.

Default strategy when modifying it:

1. deterministic shortcuts first
2. candidate shortlisting second
3. smallest possible model call third
4. caching and observability included if feasible

### AI curation / enrichment

Before touching enrichment logic, read:

- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`
- `docs/ai/ai-cost-reduction-backlog.md`

Durable rules include:

- export from prod only
- use lean exports when possible
- 3 natural examples is the default completion threshold
- keep examples natural and non-templated
- split only broad topics with clear boundaries
- keep umbrella topics when the split is fuzzy
- dry-run before live import
- spot-check before live import when plans are large or newly tuned

---

## Validation rule

When changing code, run the smallest relevant validation first.

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

### Full-stack

Validate both sides only if the task truly crosses the boundary.

---

## Anti-patterns

Avoid these unless the task explicitly requires them:

- “Let me read everything first”
- “Let me refactor while I’m here”
- “Let me redesign auth”
- “Let me add a new abstraction for future flexibility”
- “Let me change unrelated formatting”
- “Let me scan prod and local blindly without confirming environment shape”

---

## Output preference for coding agents

Prefer responses that include:

- exact file paths
- proposed change boundaries
- why the change is needed
- regression risks
- minimal validation plan

Avoid:

- long repo summaries repeated every time
- giant speculative redesigns
- broad “best practice” rewrites disconnected from Lexora

---

## If the task is still unclear

Use this escalation path:

1. `AGENTS.md`
2. `.claude/generated/request-routing.md`
3. one scoped file
4. one compact architecture or API summary
5. only then open exact code

That order is the default token-saving discipline for Lexora.
