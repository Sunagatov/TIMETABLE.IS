# Context budget rules

These rules exist to reduce token spend for coding assistants working in Memora.

They are project-specific, not generic advice.

---

## Default mindset

Treat repository context as expensive.

The default assumption is:

- most tasks are local
- most tasks do not need full-repo context
- most tasks do not need both frontend and backend
- most tasks do not need long prose summaries if compact docs already exist

---

## Default read budget

A normal Memora task should usually fit within:

- 1 repo-level file
- 1 scoped file
- 3–8 source files
- 0–3 shared helper/config files

If you go far beyond that, you should have a concrete reason.

---

## Recommended read order by task type

### Backend task

1. `AGENTS.md`
2. `backend/AGENTS.md`
3. target router/service/repository/schema files
4. shared config/deps only if needed

### Frontend task

1. `AGENTS.md`
2. `frontend/AGENTS.md`
3. target page/component/hook/API files
4. shared HTTP/routes/types only if needed

### AI optimisation task

1. `AGENTS.md`
2. `backend/AGENTS.md`
3. `docs/ai/ai-cost-reduction-backlog.md`
4. exact suggestion-flow code

### Topic enrichment / split planning task

1. `AGENTS.md`
2. `backend/AGENTS.md`
3. `docs/ai/ai-curation-workflow.md`
4. `docs/ai/example-style-guide.md`
5. exact service/script files only

### Orientation task

1. `AGENTS.md`
2. `docs/ai/repo-map.md`
3. `docs/ai/architecture.md`
4. `docs/ai/api-surface.md`

---

## Stop conditions

Stop opening more files once you know:

- the exact entry point
- the exact files to edit
- the stable contract that must not be broken
- the smallest relevant validation

If you already know those four things, loading more context is usually waste.

---

## Compression strategy

Before opening more source code, prefer these compact docs:

- `docs/ai/repo-map.md`
- `docs/ai/architecture.md`
- `docs/ai/api-surface.md`
- `docs/ai/env-reference.md`

These exist specifically to save tokens.

---

## Durable Memora rules worth keeping in memory

- export from prod only for prod imports
- 3 natural examples is the enrichment threshold
- prefer model-written examples over deterministic templates
- split only large topics with clear boundaries
- keep umbrella topics and use `parent_topic_id`
- avoid near-duplicate sibling topics
- dry-run before live import
- spot-check before live import when plans are newly tuned or large
- keep many-to-many topic membership intact
- if Alembic hits duplicate prepared statements, fix migration connection settings first

---

## Durable correctness invariants worth keeping in memory

- topic deletes depend on remaining active memberships
- explicit `null` may be invalid where omission means “unchanged”
- workbook/import paths should prefer topic IDs over names
- `example_entries: []` means clear examples
- bulk topic imports should stay atomic
- duplicate active topic names are invalid even if slugs differ
- drawer state should not leak across routes
- cache invalidation must cover stats, smart review, and trash when dependent data changes

---

## Editing strategy for low-token work

Prefer:

- modify as few files as possible
- preserve stable contracts
- avoid pure stylistic edits during bug fixes
- avoid broad renames unless they solve a real problem
- avoid mixed-purpose commits

---

## Testing strategy for low-token work

Prefer:

- targeted tests first
- broader suites only when contract surface is wide
- no repo-wide scans for tiny changes

---

## Anti-patterns

Avoid these unless explicitly justified:

- “Read everything first”
- “Open both frontend and backend for a one-line UI issue”
- “Load all routers to answer one endpoint question”
- “Refactor while investigating”
- “Re-read large docs already summarized elsewhere”
