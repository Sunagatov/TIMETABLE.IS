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

### Frontend
- React
- TypeScript
- review/search/edit UI

### Telegram bot
- Python-based thin adapter
- forwards accepted messages to backend

## Architectural priorities

- backend must stay client-agnostic
- Telegram must stay thin
- review-first trust model must remain visible everywhere
- simplicity > flexibility theater
- requirements > stale comments
- Vault runtime truth > source-repo guesses
