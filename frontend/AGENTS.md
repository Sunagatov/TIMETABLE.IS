# Frontend instructions — Memora

This file is the scoped operating contract for frontend work.

## Frontend stack

Confirmed from repository files:

- React 18
- TypeScript 5
- Vite 6

## Frontend role

The frontend is the review/search/edit UI for Memora.

It is not the source of truth for product rules.

It should express backend state clearly, not invent its own parallel business logic.

## Read order for frontend tasks

### Start with

- `frontend/package.json`
- `docs/requirements/README.md`
- exact relevant requirement file(s)

### Then

Read only the exact relevant frontend files for the task.

If architecture or invariants matter, read:
- `docs/ai/architecture.md`
- `docs/ai/invariants.md`

## Core frontend responsibilities in V1

- password login screen
- Needs Review page
- Failures page
- approved list
- item detail page or edit view
- search / filter / sort
- category tree sidebar
- category management

## Frontend invariants

### Review-first invariants

- unreviewed items are not the same as approved items
- approved list must remain separate by default
- Needs Review must stay explicit
- Failures must stay explicit

### Data model invariants

- type and category are different concepts
- category tree has exactly 3 levels in V1
- V1 type enum is:
  - `IDEA`
  - `THOUGHT`
  - `REMINDER`
  - `OTHER`
- original AI output and latest human version must both remain visible

### Editing invariants

- approved items can still be edited later
- human edits do not automatically send items back into review in V1
- category deletion must be forbidden if category is not empty

## UI/UX guardrails

- keep the interface fast and clear
- reduce friction in review flows
- do not hide critical state transitions
- do not blur approved vs review/failure states
- prefer clarity over decorative complexity
- keep filters and sorting easy to understand
- make category hierarchy readable

## Product boundaries to respect

Do not accidentally add into V1:

- labels
- question-answering workflow
- regeneration features
- new-category approval workflow
- audio playback/download
- view-count sorting

If the UI needs placeholders for future features, make that explicit and non-active.

## Production/runtime boundary

Frontend source docs here should not become fake deployment documentation.

If the task is about prod domains, ports, app.yaml, containers, runtime topology, or deployment workflows, read Vault docs instead.

## Change strategy

When working on frontend:

- keep changes feature-local
- do not invent extra state layers unless required
- avoid broad UI redesigns without explicit product reason
- preserve route and page intent
- keep requirements and UI behavior aligned

## Validation

Use the smallest relevant validation first:
- targeted build
- exact frontend validation needed by the task
