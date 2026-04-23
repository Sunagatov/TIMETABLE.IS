# Backend

This folder owns Memora backend business logic and persistence.

## Role

The backend is the **source of truth** for Memora.

It must stay reusable by future clients beyond Telegram.

## Confirmed stack

- Kotlin
- Spring Boot
- Spring Validation
- Spring Security
- Java 21

## Backend responsibility boundaries

The backend owns:

- item creation and persistence
- asynchronous processing orchestration
- AI integration/orchestration
- review workflow state
- failure tracking
- retry behavior
- category management
- search/filter/sort support
- session-based web auth

The backend must not be shaped around Telegram-specific assumptions.

## Important architectural rule

Do not let Telegram-specific logic leak into domain/application layers.

Telegram is only one input adapter.

## Read next

- `backend/AGENTS.md`
- `docs/requirements/`
- `docs/ai/architecture.md`
