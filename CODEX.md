# CODEX.md

## Purpose

Guidance for Codex CLI when working in this repository.

## Primary objective

Implement Memora V1 MVP exactly as described in `docs/`, while keeping the codebase easy to extend and easy for AI agents to understand.

## Constraints

- no over-engineering
- no deployment files here
- no Telegram-shaped domain logic
- no speculative abstractions
- keep files readable and reasonably small
- stay within V1 scope

## Read before writing code

1. `AGENTS.md`
2. `docs/01_SCOPE_AND_MVP.md`
3. `docs/03_FUNCTIONAL_REQUIREMENTS.md`
4. `docs/06_DOMAIN_MODEL.md`
5. `docs/07_PROCESSING_PIPELINE.md`
6. `docs/13_ENGINEERING_PRINCIPLES.md`
7. `docs/16_IMPLEMENTATION_ORDER.md`

## Implementation bias

Prefer:

- direct data flow
- explicit service boundaries
- simple tests
- simple DTOs
- stable package layout

Avoid:

- deep inheritance
- framework-heavy patterns
- generic base classes with unclear value
- speculative plugin systems
