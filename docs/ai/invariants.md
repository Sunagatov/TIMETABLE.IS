# Durable Invariants

## Product invariants

- single-user system in V1
- capture via Telegram
- processing asynchronous
- accepted items are durably stored before background processing
- backend source of truth
- Telegram thin adapter only
- review-first trust model
- approved list separate from review/failure areas
- one message = one item
- direct edits must not bypass review semantics for unapproved items

## Model invariants

- type != category
- type enum is exactly:
  - `IDEA`
  - `THOUGHT`
  - `QUESTION`
  - `REMINDER`
  - `OTHER`
- category tree is exactly 3 levels in V1
- original AI output and latest human version both remain visible
- answer lifecycle is explicit and may be `NONE`, `GENERATED`, `EDITED`, `REJECTED`, `DELETED`, or `FAILED`
- category proposals are explicit and use `proposedCategoryPath` plus `proposedCategoryStatus`
- item status groups must stay conceptually separate:
  - Needs Review (`AI_PROCESSED_UNREVIEWED`)
  - Failures (`TRANSCRIPTION_FAILED`, `AI_PROCESSING_FAILED`)
  - Approved (`HUMAN_APPROVED`, `HUMAN_EDITED_APPROVED`)
  - Terminal states (`REJECTED`, `DELETED`)
- approved items remain approved after later human edits in V1
- voice items must preserve Telegram traceability metadata sufficient for operator recovery
- voice retry in V1 is intentionally bounded by the lack of Memora-owned audio storage
- Telegram ingest uses a unified text-or-voice request shape with nested voice payload
- bot-facing failure notifications are acknowledged after delivery; re-delivery uses new notificationId when item updatedAt changes

## State transition guards — all enforced in backend

- `approve`: only `AI_PROCESSED_UNREVIEWED`
- `reject`: only `AI_PROCESSED_UNREVIEWED`
- `edit-and-approve`: only `AI_PROCESSED_UNREVIEWED`
- `retry`: only `TRANSCRIPTION_FAILED` or `AI_PROCESSING_FAILED`
- direct `PATCH /api/items/{itemId}`: only `HUMAN_APPROVED` or `HUMAN_EDITED_APPROVED`
- `DELETE /api/review/{itemId}/trash`: any status
- regeneration actions update current working values while preserving the original AI snapshot fields

## Category invariants

- exactly 3 levels required: category, subcategory, subsubcategory — all non-blank
- category rename cascades `categoryPath` on linked items; `aiCategoryPath` is NOT updated (preserves original AI output)
- category delete blocked when any item uses that path
- category delete blocked for the default category path

## Filter/query param invariants

- date range params are `createdFrom` and `createdTo` (ISO date YYYY-MM-DD)
- sort format is `field-direction` (e.g. `createdAt-desc`, `title-asc`, `category-desc`)
- frontend never sends "ALL" to backend; `buildQuery()` strips it
- all three list endpoints use the same `ItemListQueryRequest` model

## V1 non-features / limitations

- no labels in V1
- no Memora-managed audio storage in V1
- no audio playback/download in web app
- no semantic search in V1
- no view-count sorting in V1
- no web-search-backed question answers in V1 (model knowledge only)
- no real AI integration yet (categorization/answer generation use stubs only)
- voice transcription is **live** via self-hosted Whisper (`whisper-worker`) — Memora backend calls `http://whisper-worker:8000/v1/audio/transcriptions`; deployment owned by Vault (`apps/whisper/`)
- MongoDB persistence is **active** in production

## Boundary invariants

- backend must stay client-agnostic
- Telegram must not own business logic
- production/deployment truth lives in Vault, not Memora source docs
