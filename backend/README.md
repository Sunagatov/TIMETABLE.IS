# Backend

Backend is Memora's source of truth.

## Structural style

The backend intentionally uses **feature/domain/area-oriented packages**.

Examples in this starter:
- `auth`
- `capture`
- `item`
- `review`
- `health`

This is preferred over a top-level structure dominated by only:
- controller
- service
- repository
- dao
- converter

Those technical parts may exist **inside a feature package**, but should not define the whole backend layout.

## Current bootstrap state

This backend is runnable and intentionally simple.

It currently uses:
- in-memory starter persistence
- session auth starter
- Telegram ingest starter
- review queue starter

Target persistence remains MongoDB, but bootstrap stays in-memory until the real persistence slice is implemented.

## Run locally

```bash
cd backend
./gradlew bootRun
```
