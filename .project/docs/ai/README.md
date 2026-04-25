# AI Docs

`.project/docs/ai/*` is Memora's canonical detailed knowledge base for AI agents and human maintainers.

Root and tool-specific files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `AMAZONQ.md`, `.claude/*`, `.amazonq/*`) are adapters. They may explain workflow, but they must not duplicate long current-state facts.

## Canonical Files

- `current-state.md` — current implementation reality, including what is live and what remains starter-level.
- `api-surface.md` — backend endpoints, request/response contracts, filter params, sort format, and state guards.
- `invariants.md` — durable product, model, state, category, query, and boundary rules.
- `repo-map.md` — current repository structure and where to start for each module.
- `request-routing-guide.md` — minimal context selection by task type.
- `token-budget-rules.md` — what to read, what to avoid, and when to stop.
- `frontend-v1-mvp.md` — detailed frontend V1 guide for auth, review workspace, filters, item detail, categories, tests, and runtime checks.
- `env-runtime-reference.md` — source-repo config keys and runtime boundary notes.
- `vault-boundary.md` — production/deployment ownership boundary.
- `architecture.md` — project architecture and responsibility split.
- `change-guide.md` — change-impact checklist: if you change X, also update/check Y.
- `local-smoke-test.md` — source-repo V1 local smoke checklist; Vault still owns runtime/deployment truth.

Other files in this directory may be useful for sequencing, but the files above own the active agent facts.

## Adapter Duplication Policy

Allowed in adapters:
- links to `AGENTS.md` and `.project/docs/ai/*`
- tool-specific workflow notes
- safety reminders about secrets, scans, and validation

Not allowed in adapters:
- endpoint lists
- current stack encyclopedias
- current backend/frontend/bot behavior summaries
- runtime/deployment details from Vault
- manually maintained generated copies of canonical docs

## Read-On-Demand Discipline

Start with `.project/docs/ai/request-routing-guide.md`. Read only the smallest exact docs and files needed for the task. Stop reading once the relevant contract, source files, and validation command are known.

Do not read archive or stale docs as active context unless the user explicitly asks. Do not scan Vault unless the task is explicitly about runtime, deployment, operations, or local orchestration.

## Updating Docs

When behavior, API contracts, invariants, repo structure, or routing changes:
- update the owning canonical file in `.project/docs/ai/*`
- use `api-surface.md` for endpoint/API contract truth
- use `invariants.md` for non-negotiable behavior
- use `current-state.md` for current implementation reality
- use `frontend-v1-mvp.md` for detailed frontend implementation guidance
- use `change-guide.md` for change-impact checklists
- update scoped `AGENTS.md` files if module-specific rules changed
- keep root/tool adapters thin
- run `bash scripts/ai/check-ai-docs.sh` (wrapper) or `bash .project/scripts/ai/check-ai-docs.sh`

When product requirements change, update `.project/docs/requirements/*` first, then sync the relevant canonical AI docs.
