# Engineering Principles for Humans and AI Agents

## Goal

Make implementation cheaper, clearer, and less assumption-heavy for Codex CLI, Claude CLI, and human maintainers.

## Core principles

### KISS
Choose the simplest design that clearly solves the actual problem.

### YAGNI
Do not build speculative abstractions.

### SOLID, pragmatically
Use SOLID when it improves clarity. Do not use it to justify unnecessary indirection.

## Coding expectations

- readable code over clever code
- explicit business rules
- small understandable modules
- avoid giant files when practical
- prefer boring, stable code

## Documentation expectations

- when behavior is subtle, document it near the code and in requirements
- do not leave AI-relevant behavior implicit
- update docs together with behavior changes

## AI-agent specific guidance

AI agents working on Memora should:
- inspect current contracts before modifying them
- avoid inventing new product scope
- avoid silently changing domain semantics
- preserve error handling quality
- preserve import/export compatibility unless explicitly changing versioned formats
- ask fewer questions by relying on these docs first

## Strong caution zones

AI agents must treat these areas carefully:
- auth/session/CSRF
- duplicate handling
- topic hierarchy changes
- soft delete vs purge
- Smart Review generation logic
- AI import/export schemas
