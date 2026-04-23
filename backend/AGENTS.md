# backend/AGENTS.md

## Purpose

Backend is Memora's source of truth.

## Responsibilities

- item lifecycle
- auth/session handling
- telegram ingest API
- review queue APIs
- future client-agnostic business logic

## Structural rule

Prefer feature/domain/area packages.

Current areas:
- `auth`
- `capture`
- `item`
- `review`
- `health`

Do not drift back into a broad global technical-layer structure.

## Rules

- do not let Telegram-specific concepts define domain logic
- prefer explicit services/use cases over framework-driven magic
- keep controllers thin
- keep status transitions explicit
- keep bootstrap code runnable
- do not move deployment/runtime concerns here
