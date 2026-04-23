# Suggested Implementation Sequence

This file helps AI agents and humans avoid working in the wrong order.

## Phase 1 — backend skeleton and domain/state contracts
- item model
- explicit lifecycle/status model
- category model
- review/failure state separation
- auth/session baseline

## Phase 2 — Telegram ingestion path
- owner validation
- message acceptance
- Memora ID generation
- async handoff
- acknowledgement/failure messaging

## Phase 3 — processing pipeline
- raw input persistence
- transcription path
- cleaned text generation
- type/category/priority inference
- failure handling

## Phase 4 — web review UI
- login
- Needs Review
- Failures
- approved list
- item detail/edit
- search/filter/sort
- category sidebar

## Phase 5 — category management
- create
- rename
- move items
- delete empty categories

## Rule

Do not jump to future-phase features before the review-first core is stable.
