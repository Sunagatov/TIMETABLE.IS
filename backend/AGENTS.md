# backend/AGENTS.md

## Purpose

Backend is Memora's source of truth.

## Responsibilities

- item lifecycle
- auth/session handling
- telegram ingest API
- review queue APIs
- category management
- future client-agnostic business logic

## Rules

- do not let Telegram-specific concepts define domain logic
- prefer application services/use cases over framework-driven magic
- keep controllers thin
- keep status transitions explicit
- do not over-engineer persistence too early
