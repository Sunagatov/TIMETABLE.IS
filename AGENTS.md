# AGENTS.md

This file exists to make work in this repository easier for AI coding agents and humans.

## Goal

Implement Memora V1 MVP with minimal ambiguity and minimal over-engineering.

## Required reading order before making changes

1. `docs/00_PRODUCT_VISION.md`
2. `docs/01_SCOPE_AND_MVP.md`
3. `docs/03_FUNCTIONAL_REQUIREMENTS.md`
4. `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
5. `docs/06_DOMAIN_MODEL.md`
6. `docs/07_PROCESSING_PIPELINE.md`
7. `docs/08_ERROR_HANDLING_AND_RETRY.md`
8. `docs/09_REVIEW_WORKFLOW.md`
9. `docs/10_AI_BEHAVIOR_RULES.md`
10. `docs/13_ENGINEERING_PRINCIPLES.md`
11. `docs/16_IMPLEMENTATION_ORDER.md`

## Hard rules

- Do not invent features outside the docs.
- Do not introduce Docker or deployment files in this repository.
- Do not couple backend business logic to Telegram transport details.
- Do not build for multi-user in V1.
- Do not add labels, semantic search, question answering, regeneration flows, or AI-created categories in V1.
- Keep code boring and explicit.
- Prefer straightforward application services/use cases over abstraction-heavy designs.
- Prefer small files where practical. Aim for roughly under 350 LOC if possible.
- Preserve terminology from the docs.

## Architecture expectation

- `backend/` owns business logic and persistence contracts.
- `telegram-bot/` is a thin adapter/client to backend APIs.
- `frontend/` is the review/search/edit UI.
- `docs/` is the source of truth for requirements and scope.

## If requirements and code conflict

The docs win unless the user explicitly changed the requirement later in chat.

## How to implement incrementally

Follow `docs/16_IMPLEMENTATION_ORDER.md`.
