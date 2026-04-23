# CLAUDE.md

## Purpose

Compact guidance for Claude CLI.

## Core instructions

- Respect `docs/requirements/` first.
- Respect Vault boundary.
- Keep Memora feature-oriented, not globally layer-oriented.
- Keep code easy to extend for the next AI agent.
- Do not widen scope silently.

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
3. relevant files under `docs/requirements/`
4. smallest relevant subproject `AGENTS.md`
