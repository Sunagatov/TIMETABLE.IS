# Memora

Memora is a private, single-user system for capturing thoughts in Telegram, processing them asynchronously, and reviewing/searching them in a web app.

## Important reading order

1. `AGENTS.md`
2. `docs/00_PRODUCT_VISION.md`
3. `docs/01_SCOPE_AND_MVP.md`
4. `docs/03_FUNCTIONAL_REQUIREMENTS.md`
5. `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
6. `docs/13_ENGINEERING_PRINCIPLES.md`
7. `docs/16_IMPLEMENTATION_ORDER.md`

## Repository intent

This repo is optimized for:

- low ambiguity
- small scoped changes
- Claude CLI and Codex CLI continuity
- KISS / YAGNI
- client-agnostic backend design

## Core repo layout

- `backend/`
- `frontend/`
- `telegram-bot/`
- `docs/`
- `.claude/generated/`

## Important note

Deployment and infrastructure concerns belong in a different repository.
