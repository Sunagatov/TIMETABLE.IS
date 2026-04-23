# Client and API Boundaries

## Core rule

Backend is the source of truth.

Clients consume backend behavior.

## Telegram bot boundary

Telegram bot is:
- transport adapter
- input channel
- acknowledgement/failure notifier

Telegram bot is not:
- source of truth
- main business-logic owner
- second backend

## Frontend boundary

Frontend is:
- review/search/edit UI
- consumer of backend contracts

Frontend is not:
- final authority on state transitions
- alternative source of truth

## Future-client requirement

Memora backend must remain reusable by future:
- mobile clients
- desktop clients
- other bot or capture clients

## Anti-coupling rule

Telegram-specific assumptions must not leak deeply into backend domain/application logic.
