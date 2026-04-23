# Backend instructions — Memora

## Role

Backend is the source of truth.

It owns:

- item lifecycle
- review workflow
- failure handling
- category tree logic
- auth/session logic
- search/filter/sort contracts
- AI orchestration
- Telegram-facing ingestion endpoints for the bot adapter

## Current stack

- Kotlin
- Spring Boot
- Spring Validation
- Spring Security
- future persistence layer to be added incrementally

## Read order for backend work

1. `AGENTS.md`
2. `docs/03_FUNCTIONAL_REQUIREMENTS.md`
3. `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
4. `docs/06_DOMAIN_MODEL.md`
5. `docs/07_PROCESSING_PIPELINE.md`
6. `docs/08_ERROR_HANDLING_AND_RETRY.md`
7. `docs/09_REVIEW_WORKFLOW.md`
8. `docs/10_AI_BEHAVIOR_RULES.md`
9. `docs/13_ENGINEERING_PRINCIPLES.md`
10. current backend entrypoints:
   - `backend/src/main/kotlin/com/sunagatov/memora/backend/MemoraBackendApplication.kt`
   - `backend/src/main/kotlin/com/sunagatov/memora/backend/web/`
   - `backend/src/main/resources/application.yml`
11. only then the exact files touched by the task

Do **not** scan the whole backend by default.

## Architectural pattern to preserve

Preferred backend flow:

1. web/controller layer handles transport concerns
2. application/use-case layer applies business rules
3. persistence/repository layer performs storage work
4. DTO/schema layer shapes API payloads

Stay consistent with this pattern unless there is a clear reason not to.

## Backend invariants

- one Telegram message becomes exactly one item
- approved items and review items are separate concepts
- failures must persist with retry metadata
- default main list contains only human-approved items
- type and category are separate concepts
- V1 category tree is exactly 3 levels
- Telegram-specific logic must not leak into application/domain rules

## Auth/session invariants

- single-user password login
- backend-managed session
- configurable session lifetime
- expired/invalid session should be visible to frontend as a clean auth failure path
- keep implementation aligned with secure cookie/session handling

## AI workflow invariants

- AI may clean text, suggest type, category path, and priority
- AI must not silently add out-of-scope behavior
- AI-created categories are not part of V1
- question-answering is not part of V1
- regeneration flows are not part of V1

## Validation

Use the smallest relevant validation first.

Examples:
- targeted backend test
- narrow app startup check
- feature-focused validation

Do not run broad scans first unless the task is broad.
