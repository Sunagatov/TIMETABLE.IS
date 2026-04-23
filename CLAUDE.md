# CLAUDE.md

## Purpose

Guidance for Claude CLI when working in this repository.

## What matters most

- Keep the codebase easy to navigate.
- Respect docs before coding.
- Avoid speculative architecture.
- Preserve backend/client separation.
- Prefer explicit state transitions and clear DTOs.

## Before coding

Read:

- `AGENTS.md`
- `docs/03_FUNCTIONAL_REQUIREMENTS.md`
- `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
- `docs/13_ENGINEERING_PRINCIPLES.md`
- `docs/16_IMPLEMENTATION_ORDER.md`

## Coding style

- choose simple names
- keep use cases explicit
- avoid hidden magic
- avoid large files where practical
- no deployment concerns here
- no Docker files here
- do not silently add new dependencies without reason

## When adding code

Update docs only if behavior changes.  
Do not drift from requirements.
