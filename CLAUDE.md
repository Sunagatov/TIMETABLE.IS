# CLAUDE.md

## Purpose

Compact guidance for Claude CLI.

## Core instructions

- Respect `docs/requirements/` first.
- Respect Vault boundary.
- Keep Memora feature-oriented, not globally layer-oriented.
- Keep code easy to extend for the next AI agent.
- Do not widen scope silently.
- Prefer current uppercase requirement files when both uppercase and legacy lowercase variants exist.
- Keep the current contract snapshot in `docs/ai/current-bootstrap-state.md` and `docs/ai/api-surface.md` aligned with code changes.

## Implementation bias

Prefer:

- feature/domain packages
- thin controllers / handlers
- explicit application services
- boring DTOs
- explicit status transitions
- clear names
- small files

Avoid:

- speculative abstractions
- framework-heavy indirection
- cross-repo deployment changes here
- top-level controller/service/repository package sprawl

## Read before coding

1. `AGENTS.md`
2. `docs/ai/current-bootstrap-state.md`
3. `docs/ai/api-surface.md` when the task touches endpoint or DTO contracts
4. `docs/ai/request-routing-guide.md`
5. relevant files under `docs/requirements/`
6. smallest relevant subproject `AGENTS.md`

## Current backend reality

- backend foundation now includes `auth`, `capture`, `category`, `item`, `review`, `health`
- backend item model separates original AI output from latest human-facing values
- category path is exactly 3 levels in V1
- Telegram ingest is unified at `POST /api/capture/telegram/ingest` with exactly one of text or nested voice payload
- bot-facing failure notifications are polled from the backend and acknowledged after delivery
- voice ingest persists Telegram traceability metadata and lands in visible retryable failure state until transcription exists
- approved items stay approved after direct human edits; reviewable edits go through `edit-and-approve`
- single-user auth uses backend-managed session cookies and password-hash config
- the frontend review shell defaults to Needs Review and keeps approved search/filter/sort client-side for now
