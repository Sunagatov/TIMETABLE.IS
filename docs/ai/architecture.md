# Architecture Summary

## Product shape

Memora is a single-user, review-first capture system.

### Capture
Telegram bot.

### Source of truth
Backend.

### Review/search/edit
Web frontend.

## Runtime/source split

### Memora source repository
Owns source code, requirements, and implementation docs.

### Vault repository
Owns production/deployment/runtime truth.

## Confirmed source modules

### Backend
- Kotlin
- Spring Boot
- source of truth
- business logic owner
- current foundation uses explicit application services and in-memory stores
- current backend feature areas:
  - `auth`
  - `capture`
  - `category`
  - `item`
  - `review`
  - `health`

### Frontend
- React
- TypeScript
- review/search/edit UI

### Telegram bot
- Kotlin-based thin adapter using Telegram long polling
- forwards accepted messages to backend
- polls backend failure notifications for operator-facing follow-up

## Architectural priorities

- backend must stay client-agnostic
- Telegram must stay thin
- review-first trust model must remain visible everywhere
- original AI output and latest human-approved values must remain separately visible
- category model must stay exactly 3 levels in V1
- direct item edits must not bypass review semantics
- simplicity > flexibility theater
- requirements > stale comments
- Vault runtime truth > source-repo guesses
