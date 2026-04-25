# AI Docs

`docs/ai/*` is Memora's canonical detailed knowledge base for AI agents and human maintainers.

Root and tool-specific files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `AMAZONQ.md`, `.claude/*`, `.amazonq/*`) are adapters. They may explain workflow, but they must not duplicate long current-state facts.

## Canonical Files

- `current-bootstrap-state.md` — current implementation reality, including what is live and what remains starter-level.
- `api-surface.md` — backend endpoints, request/response contracts, filter params, sort format, and state guards.
- `invariants.md` — durable product, model, state, category, query, and boundary rules.
- `repo-map.md` — current repository structure and where to start for each module.
- `request-routing-guide.md` — minimal context selection by task type.
- `token-budget-rules.md` — what to read, what to avoid, and when to stop.
- `env-runtime-reference.md` — source-repo config keys and runtime boundary notes.
- `vault-boundary.md` — production/deployment ownership boundary.
- `architecture.md` — project architecture and responsibility split.

Other files in this directory may be useful for sequencing or change checklists, but the files above own the active agent facts.

## Adapter Duplication Policy

Allowed in adapters:
- links to `AGENTS.md` and `docs/ai/*`
- tool-specific workflow notes
- safety reminders about secrets, scans, and validation

Not allowed in adapters:
- endpoint lists
- current stack encyclopedias
- current backend/frontend/bot behavior summaries
- runtime/deployment details from Vault
- manually maintained generated copies of canonical docs

## Read-On-Demand Discipline

Start with `docs/ai/request-routing-guide.md`. Read only the smallest exact docs and files needed for the task. Stop reading once the relevant contract, source files, and validation command are known.

Do not read archive or stale docs as active context unless the user explicitly asks. Do not scan Vault unless the task is explicitly about runtime, deployment, operations, or local orchestration.

## Updating Docs

When behavior, API contracts, invariants, repo structure, or routing changes:
- update the owning canonical file in `docs/ai/*`
- update scoped `AGENTS.md` files if module-specific rules changed
- keep root/tool adapters thin
- run `bash scripts/ai/check-ai-docs.sh`

When product requirements change, update `docs/requirements/*` first, then sync the relevant canonical AI docs.
