# Memora

Memora is a private, single-user system for capturing thoughts through a Telegram bot, processing them asynchronously, and reviewing/searching them in a web app.

This repository is intentionally optimized for:

- clear architecture
- low ambiguity
- Claude CLI and Codex CLI friendliness
- KISS / YAGNI / maintainability
- client-agnostic backend design

## Repository structure

```text
Memora/
  docs/
  backend/
  frontend/
  telegram-bot/
  AGENTS.md
  CLAUDE.md
  CODEX.md
  CONTRIBUTING.md
  .env.example
```

## Important notes

- Deployment and infrastructure are intentionally **not** stored in this repository.
- Telegram is only one client/adapter. Backend business logic must remain reusable by future clients.
- The first implementation target is the V1 MVP described in `docs/`.

## Reading order

1. `AGENTS.md`
2. `docs/00_PRODUCT_VISION.md`
3. `docs/01_SCOPE_AND_MVP.md`
4. `docs/03_FUNCTIONAL_REQUIREMENTS.md`
5. `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
6. `docs/13_ENGINEERING_PRINCIPLES.md`
7. `docs/16_IMPLEMENTATION_ORDER.md`

## Local development

This repository currently contains a **starter skeleton** and requirements pack.

Each app folder has its own README and starter files:

- `backend/`
- `frontend/`
- `telegram-bot/`

## Current status

This is a repo-ready foundation for implementation, not the finished app.
