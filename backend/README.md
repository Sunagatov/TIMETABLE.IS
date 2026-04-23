# Backend

This folder owns Memora business logic and persistence.

## Role

The backend is the source of truth.

It must remain client-agnostic and reusable by future clients beyond Telegram.

## Suggested stack

- Kotlin
- Spring Boot
- PostgreSQL (later during implementation)
- session-based auth

## Proposed package direction

```text
com.sunagatov.memora.backend
  app
  domain
  application
  infrastructure
  web
```

## Important rule

Do not let Telegram-specific logic leak into domain/application layers.
