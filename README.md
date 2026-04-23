# Memora

**Memora** is a private, single-user thought-capture and review system built around:

- Telegram-first capture
- asynchronous backend processing
- review-first trust in AI output
- web-based search, filtering, editing, and approval
- a backend that stays reusable for future clients beyond Telegram

This repository is the **application source monorepo** for Memora.

It is **not** the production deployment source of truth.

## Source-of-truth split

### This repository owns

- application source code
- product requirements
- AI/human working docs for implementation
- backend, frontend, and telegram-bot source
- project-level architecture and invariants

### Vault owns

Production and deployment/runtime files for Memora live in the **Vault** project, not here.

Local development path on the MacBook:

- `/Users/zufar/IdeaProjects/Vault`

Repository:

- `Sunagatov/Vault`

Primary Vault area for Memora:

- `apps/memora/`

Important Vault docs for Memora operations:

- `apps/memora/README.md`
- `apps/memora/AI_AGENT_GUIDE.md`
- `apps/memora/CHANGE_MAP.md`
- `apps/memora/PORTS_AND_RUNTIME.md`
- `apps/memora/ENV_CONTRACT.md`

## Current source modules

- `backend/` — Kotlin + Spring Boot backend and source-of-truth business logic
- `frontend/` — React + TypeScript web UI
- `telegram-bot/` — Kotlin-based thin Telegram adapter
- `docs/requirements/` — product requirements and project contracts
- `docs/ai/` — compact context for Claude CLI, Codex CLI, and human maintainers

## Structural style used in this repository

This repository intentionally prefers **domain / feature / area oriented structure** over pure technical layers.

That means:

- backend code should be grouped into areas like `auth`, `capture`, `review`, `item`
- frontend code should be grouped into `features/*` and `shared/*`
- telegram bot code should be grouped into `bot`, `command`, `backend`, `ingest`, `config`

Pure global layering like only `controller / service / repository / dao / converter` at the top level is not the preferred style here.

## Current bootstrap state

This repository now contains a **runnable starter implementation** for backend, frontend, and telegram-bot.

Important bootstrap limitation:

- backend persistence is currently **in-memory starter persistence**
- voice capture is currently accepted and persisted with metadata, but full transcription integration is a later implementation slice
- the product requirements still define the target V1 behavior; the current code is the starter foundation to implement toward that target

See:

- `docs/ai/current-bootstrap-state.md`
- `docs/requirements/08_tech-stack-decision.md`
- `docs/ai/repo-map.md`
- `docs/ai/change-playbook.md`

## Read order

### Humans

1. `AGENTS.md`
2. `docs/requirements/README.md`
3. `docs/ai/README.md`
4. the smallest relevant scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`

### Claude CLI / Codex CLI

Use the same order.

Do not start by scanning the whole repository.

## Stack at a glance

### Backend

- Kotlin 2.3.10
- Java 25 (LTS)
- Spring Boot 4.0.5
- Spring Security
- MongoDB target persistence
- Gradle Kotlin DSL

### Frontend

- React 19.2.1
- TypeScript 6.0.2
- Vite 8.0.8
- TanStack Query 5.99.1
- React Hook Form 7.73.0
- Zod 4.3.6
- Tailwind CSS 4.2.2

### Telegram bot

- Kotlin 2.3.10
- Java 25
- TelegramBots 9.2.0
- thin adapter that forwards accepted messages to backend

## Current repository purpose

These docs and starter files exist to prevent AI agents and humans from:

- carrying over stale assumptions
- coupling backend to Telegram
- guessing deployment/runtime truth from source files
- over-engineering initial V1
- wasting tokens on avoidable repo-wide scans
