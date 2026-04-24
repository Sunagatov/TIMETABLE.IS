# backend/AGENTS.md

## Purpose

Backend is Memora's source of truth.

## Responsibilities

- item lifecycle
- auth/session handling
- telegram ingest API
- review queue APIs
- category CRUD baseline
- future client-agnostic business logic

## Structural rule

Prefer feature/domain/area packages.

Current areas:
- `auth`
- `capture`
- `category`
- `common`
- `config`
- `health`
- `item`
- `review`

Do not drift back into a broad global technical-layer structure.

## Rules

- do not let Telegram-specific concepts define domain logic
- prefer explicit services/use cases over framework-driven magic
- keep controllers thin
- keep status transitions explicit
- keep bootstrap code runnable
- do not move deployment/runtime concerns here
- keep category paths exactly 3 levels in V1
- preserve original AI output separately from latest human-facing item values
- use in-memory stores until a task explicitly upgrades persistence
- current narrow backend validation is usually:
  - `cd backend && ./gradlew compileKotlin`
  - `cd backend && ./gradlew test`
