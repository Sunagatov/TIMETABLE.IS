# Memora

Memora is a private, single-user capture and review system built around:

- Telegram-first capture
- asynchronous backend processing
- review-first trust in AI output
- web-based search, filtering, editing, and approval
- a backend that stays reusable for future clients beyond Telegram

This repository is the application source monorepo for Memora. It is not the production deployment source of truth.

## Source-Of-Truth Split

This repository owns:
- application source code
- product requirements
- source-level architecture and invariants
- AI/human implementation guidance
- backend, frontend, and telegram-bot source

Vault owns production, deployment, runtime, and orchestration truth.

Local Vault path:
- `/Users/zufar/IdeaProjects/Vault`

Repository:
- `Sunagatov/Vault`

Primary runtime areas:
- `apps/memora/`
- `apps/whisper/`

## Current Source Modules

- `backend/` — Kotlin + Spring Boot backend and source-of-truth business logic.
- `frontend/` — React + Vite + TypeScript web UI.
- `telegram-bot/` — Kotlin thin Telegram adapter.
- `.project/docs/requirements/` — product requirements and V1 contracts.
- `.project/docs/ai/` — canonical detailed AI-agent context for current implementation reality, API surface, invariants, routing, repo map, and token-budget rules.

## Current State

Detailed current implementation state lives in:
- `.project/docs/ai/current-state.md`
- `.project/docs/ai/api-surface.md`
- `.project/docs/ai/invariants.md`
- `.project/docs/ai/repo-map.md`
- `.project/docs/ai/frontend-v1-mvp.md` for detailed frontend agent guidance

Keep this README high-level. Do not duplicate long current-state summaries here.

## Structural Style

Memora intentionally prefers domain, feature, and area oriented structure over pure technical layers.

Examples:
- backend: `auth`, `capture`, `category`, `item`, `review`, `transcription`
- frontend: `features/*`, `shared/*`, `app/*`
- telegram bot: `bot`, `command`, `backend`, `ingest`, `config`

Pure global layering like only `controller / service / repository / dao / converter` at the top level is not the preferred style.

## Read Order

For implementation work:

1. `AGENTS.md`
2. `.project/docs/ai/request-routing-guide.md`
3. `.project/docs/ai/README.md`
4. the smallest relevant canonical docs under `.project/docs/ai/`
5. the smallest relevant scoped guide:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`

Do not start by scanning the whole repository.

## Stack At A Glance

Backend:
- Kotlin
- Java
- Spring Boot
- Spring Security
- Spring Data MongoDB
- MongoDB

Frontend:
- React
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS

Telegram bot:
- Kotlin
- Java
- Telegram long polling
- thin adapter forwarding supported owner inputs to the backend

## Runtime Boundary

For deployment, local orchestration, production config, server operations, and Whisper runtime details, use Vault instead of this repository.
