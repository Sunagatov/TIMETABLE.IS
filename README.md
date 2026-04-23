# Memora

**Memora** is a personal thought-capture and review system built around:

- Telegram-first capture
- asynchronous backend processing
- review-first trust in AI output
- web-based search, filtering, editing, and approval
- a backend that stays reusable for future clients beyond Telegram

This repository is the **application source monorepo** for Memora.

It is not the production deployment source of truth.

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
- `telegram-bot/` — thin Telegram adapter
- `docs/requirements/` — product requirements and project contracts
- `docs/ai/` — compact context for Claude CLI, Codex CLI, and human maintainers

## Product direction

Memora is not a generic note-taking app.

It is a **private, single-user capture-and-review system** designed to help the user:

- get thoughts out of the head quickly
- capture them via Telegram voice or text
- process them asynchronously
- review AI output before trusting it
- retrieve approved items later in the web app

## Core implementation stance

- backend is source of truth
- Telegram is an adapter, not the center of the architecture
- AI output is useful but not trusted blindly
- approved knowledge base is separate from unreviewed/failure queues
- simplicity, clarity, and maintainability matter more than cleverness

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
- Kotlin 2.0.x
- Java 21
- Spring Boot 3.4.x
- Spring Security
- validation

### Frontend
- React 18
- TypeScript 5
- Vite 6

### Telegram bot
- Python-based thin adapter
- forwards accepted messages to backend
- should remain transport-focused

## Current repository purpose

The repository is still early-stage.

These docs exist to prevent AI agents and humans from:

- carrying over stale Lexora assumptions
- coupling backend to Telegram
- guessing deployment/runtime truth from source files
- over-engineering initial V1
- wasting tokens on avoidable repo-wide scans
