# Current Bootstrap State

## Important truth

This repository now contains a **runnable starter** for backend, frontend, and telegram bot.

It is not yet the full target V1 implementation.

## What is already real

- root repo guidance and Vault boundary
- feature/domain-oriented package and folder direction
- backend auth/session baseline with password-hash checking and session cookie flow
- backend unified ingest baseline for Telegram text and nested voice metadata
- backend bot-facing failure notification polling and delivery acknowledgement endpoints
- backend review queue APIs for Needs Review, Failures, and approved items
- backend 3-level category model and CRUD baseline
- backend explicit item lifecycle/status model
- backend separation of original AI output vs latest human-facing item values
- backend direct item patch is approved-only; reviewable edits go through `edit-and-approve`
- backend in-memory stores for items, sessions, and categories
- frontend session-aware login + review workspace starter
- frontend review workspace now includes default Needs Review landing, Failures, approved list, category sidebar, edit panel, and client-side approved search/filter/sort shell
- Kotlin telegram bot starter
- stable stack versions

## What is still intentionally starter-level

- Mongo persistence is not implemented yet
- transcription is not implemented yet
- AI integration is not implemented yet
- category CRUD management UI is not implemented yet
- deployment/runtime is still owned by Vault, not here

## Backend foundation details that already matter

- backend packages now include:
  - `auth`
  - `capture`
  - `category`
  - `common`
  - `config`
  - `health`
  - `item`
  - `review`
- voice ingest persists Telegram traceability metadata and currently lands in visible retryable transcription failure state
- backend exposes bot-facing failure notification polling + delivery acknowledgement endpoints for failed Telegram items
- text ingest currently lands in Needs Review with normalized text and default category path
- approved item edits remain approved in V1; reviewable edits require `edit-and-approve`
- category paths are exact leaf paths with `category`, `subcategory`, `subsubcategory`
- default backend category path is configured through `DEFAULT_CATEGORY_PATH`
- single-user Telegram ingest is gated by configured owner Telegram user ID
- current frontend behavior stays review-first: default landing is Needs Review, approved list is approved-only, and approved search/filter/sort is still client-side

## Default backend validation

- `cd backend && ./gradlew compileKotlin`
- `cd backend && ./gradlew test`

## Why this state is useful

It gives Claude CLI / Codex CLI a clean, runnable, style-correct foundation instead of forcing them to start from a generic scaffold or from the wrong package shape.
