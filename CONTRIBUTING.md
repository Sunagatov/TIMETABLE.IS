# Contributing

## Working style

This repository is optimized for both humans and AI coding agents.

## Structural expectations

Prefer feature/domain/area-oriented changes.

Examples:

- `backend/.../auth/...`
- `backend/.../capture/...`
- `frontend/src/features/review/...`
- `telegram-bot/.../ingest/...`

Avoid broad changes that introduce top-level technical layer sprawl.

## Boundary reminders

- Application source lives here.
- Production/deployment/runtime truth lives in `Sunagatov/Vault`, especially `apps/memora/`.

## Pull request mindset

A good change is:

- scoped
- understandable
- easy to review
- aligned with `.project/docs/requirements/`
- consistent with the current package and folder style
