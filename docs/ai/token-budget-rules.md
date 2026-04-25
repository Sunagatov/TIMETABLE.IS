# Token Budget Rules

## Default Mindset

Repository context is expensive. Start from routing, then read only the smallest exact files required.

Use:
- `AGENTS.md` as the bootloader.
- `docs/ai/request-routing-guide.md` to choose minimal context.
- `docs/ai/current-bootstrap-state.md` for current implementation reality.
- `docs/ai/api-surface.md` for endpoint, DTO, filter, sort, and state-guard contracts.
- `docs/ai/invariants.md` for non-negotiable behavior.
- scoped `AGENTS.md` files for module-specific rules.

Do not use `CLAUDE.md`, `CODEX.md`, `AMAZONQ.md`, `.claude/*`, or `.amazonq/*` for project facts. They are adapters only.

## Avoid Loading

- whole-repo scans when a scoped route is enough
- all three modules for a one-module task
- archive, stale, or removed-context docs as active context unless explicitly requested
- generated/cached agent context as canonical truth
- Vault docs unless the task is explicitly about runtime, deployment, production operations, or local orchestration

## Stop Conditions

Stop opening files once you know:
- exact entry point
- exact files to change
- exact requirement or invariant involved
- exact API/field/contract names
- smallest validation command needed

## High-Risk Contract Reminders

- Date filters are `createdFrom` and `createdTo`, not `dateFrom` or `dateTo`.
- Sort format is `field-direction`, for example `createdAt-desc`, `title-asc`, `category-desc`.
- Category paths are exactly 3 levels in V1.
- `aiCategoryPath` preserves original AI output; category rename updates `categoryPath`, not `aiCategoryPath`.
- Telegram bot remains a thin adapter: no DB writes, transcription/Whisper calls, AI/category/review/item lifecycle logic, or local retry state.
- Voice transcription is live through the backend transcription integration; runtime/service details are owned by Vault.
- MongoDB persistence is active in production; in-memory stores are test/local only.
- Spring Boot 4 uses `spring.mongodb.uri` / `SPRING_MONGODB_URI`, not `spring.data.mongodb.uri`.

## Editing Strategy

- modify as few files as needed
- prefer vertical slices
- avoid stylistic churn
- update the canonical owner doc when behavior, contracts, routing, or repo structure changes
- keep agent-specific adapters thin
- run `bash scripts/ai/check-ai-docs.sh` after documentation architecture changes
