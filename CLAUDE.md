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
3. `docs/ai/request-routing-guide.md`
4. relevant files under `docs/requirements/`
5. smallest relevant subproject `AGENTS.md`

## Current backend reality

- backend foundation now includes `auth`, `capture`, `category`, `item`, `review`, `health`
- backend item model separates original AI output from latest human-facing values
- category path is exactly 3 levels in V1
- voice ingest currently persists Telegram traceability metadata and lands in visible failure state until transcription exists
- single-user auth uses backend-managed session cookies and password-hash config
