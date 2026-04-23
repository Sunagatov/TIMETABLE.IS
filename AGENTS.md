# Memora — Repository Agent Instructions

This file is the **main working contract** for coding agents and humans in the Memora repository.

If only one file is read before starting work, it should be this file.

## What Memora is

Memora is a private, single-user capture-and-review system.

The current V1 product direction is:

- capture via Telegram voice and text
- asynchronous processing
- review-first trust model
- web-based review, editing, and retrieval
- strict separation between approved items and unreviewed/failed items

## What this file is for

This file exists to reduce:

- token waste
- repo-wide scanning
- stale assumptions
- accidental coupling
- “Lexora template” carry-over mistakes

It defines:

- what to read first
- what not to read by default
- which contracts are stable
- where production/deployment truth lives
- how to keep changes narrow and safe

## Absolute naming rule

This project is **Memora**.

Agents must not describe it as Lexora or Mindraft.

If any stale file still contains those names, treat that as documentation debt to be fixed, not as product truth.

## Default read order

### Always

1. `AGENTS.md`
2. `.claude/generated/request-routing.md` if the task is still broad
3. `docs/requirements/README.md`
4. the smallest relevant scoped file:
   - backend task -> `backend/AGENTS.md`
   - frontend task -> `frontend/AGENTS.md`
   - telegram-bot task -> `telegram-bot/AGENTS.md`

### Then

Read only:

- exact files to change
- 0–3 small supporting files if truly necessary
- exact requirement/AI notes relevant to the task

### Do not do this by default

- do not scan the whole repo
- do not read all three modules for a one-sided task
- do not carry Lexora assumptions into Memora
- do not infer deployment truth from source repo files

## Source-of-truth boundaries

### Application source-of-truth
This repository:
- source code
- requirements
- architecture
- implementation guidance

### Production/deployment source-of-truth
Vault repository:
- `/Users/zufar/IdeaProjects/Vault`
- `Sunagatov/Vault`
- `apps/memora/**`

When a task touches:
- prod deployment
- runtime/container topology
- server ports/domains
- env contracts
- app.yaml / docker-compose in production
- deploy/rollback/recovery workflows

read Vault docs first, not Memora source docs.

Start with:

- `apps/memora/README.md`
- `apps/memora/AI_AGENT_GUIDE.md`
- `apps/memora/CHANGE_MAP.md`
- `apps/memora/PORTS_AND_RUNTIME.md`
- `apps/memora/ENV_CONTRACT.md`

## Project shape

### Root
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `.claude/generated/request-routing.md`
- `backend/`
- `frontend/`
- `telegram-bot/`
- `docs/requirements/`
- `docs/ai/`

### Backend
Kotlin + Spring Boot source-of-truth backend.

### Frontend
React + TypeScript web UI.

### Telegram bot
Thin Python-based Telegram adapter.

### Docs
- `docs/requirements/` = product requirements, constraints, scope
- `docs/ai/` = token-saving summaries for AI agents and humans

## Hard operating rules

### 1. Narrow context first
Repository context is expensive.

Most tasks should need:
- 1 repo-level file
- 1 scoped file
- a handful of exact source files
- 0–2 compact docs

### 2. Minimal diffs first
Prefer the smallest change that solves the real problem.

### 3. Preserve stable contracts
Do not casually change:
- backend client-agnostic boundary
- review-first trust model
- separation of approved vs unreviewed/failed items
- one Telegram message = one item
- exact three-level category model
- type/category separation
- “Telegram is thin” rule
- source-vs-Vault boundary

### 4. KISS and YAGNI first
Memora is early-stage.
Do not introduce abstractions for imagined future scale unless a real current requirement demands them.

### 5. Telegram is not the backend
Telegram bot must stay transport-focused.
Business logic belongs in backend use cases/services.

### 6. Production truth is not here
If the task is operational or deployment-related, read Vault.

## Stable Memora invariants

### Product invariants
- single-user system in V1
- Telegram bot accepts only configured owner user ID
- one message becomes one item
- processing is asynchronous
- fresh processed items must not automatically join approved list
- review happens in web app
- main list contains only human-approved items by default
- dedicated Needs Review and Failures areas must exist

### Content invariants
- V1 type enum:
  - `IDEA`
  - `THOUGHT`
  - `REMINDER`
  - `OTHER`
- category tree is exactly 3 levels
- if AI is uncertain about type -> `OTHER`
- if AI is uncertain about category -> default category path
- approved items can still be edited later
- original AI output and latest human version must both remain visible

### Architecture invariants
- backend is source of truth
- future clients beyond Telegram must stay possible
- telegram-bot must not own business logic
- frontend should consume backend contracts rather than duplicating rules

### V1 limitation invariants
- no Memora-managed audio storage in V1
- only Telegram references/IDs are persisted for voice traceability
- no QUESTION workflow in V1 MVP
- no labels in V1 MVP
- no regeneration workflows in V1 MVP
- no AI-created new categories in V1 MVP
- no view-count sorting in V1 MVP

## Required output style for agents

Prefer output that includes:
- exact file paths
- exact contract being preserved
- smallest useful change boundary
- regression risks
- smallest validation to run

Avoid:
- giant speculative redesigns
- sweeping refactors “while here”
- repeating entire repo summaries every time
- changing unrelated modules
- inventing runtime/deployment behavior that belongs in Vault

## If the task is unclear

Use this escalation path:

1. `AGENTS.md`
2. `.claude/generated/request-routing.md`
3. `docs/requirements/README.md`
4. one scoped `AGENTS.md`
5. one or two compact docs from `docs/ai/`
6. only then inspect exact source files

That is the default token-saving discipline for Memora.
