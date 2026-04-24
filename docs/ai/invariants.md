# Durable Invariants

## Product invariants

- single-user system in V1
- capture via Telegram
- processing asynchronous
- backend source of truth
- Telegram thin adapter only
- review-first trust model
- approved list separate from review/failure areas
- one message = one item

## Model invariants

- type != category
- type enum is exactly:
  - `IDEA`
  - `THOUGHT`
  - `REMINDER`
  - `OTHER`
- category tree is exactly 3 levels in V1
- original AI output and latest human version both remain visible
- item status groups must stay conceptually separate:
  - Needs Review
  - Failures
  - Approved
  - Rejected/deleted terminal states
- approved items remain approved after later human edits in V1
- voice items must preserve Telegram traceability metadata sufficient for operator recovery attempts

## V1 non-features / limitations

- no QUESTION workflow in V1
- no labels in V1
- no AI-created category proposals in V1
- no regeneration workflows in V1
- no Memora-managed audio storage in V1
- no audio playback/download in web app
- no semantic search in V1
- no view-count sorting in V1
- no Memora-owned transcription implementation yet in current bootstrap backend
- no Mongo persistence yet in current bootstrap backend

## Boundary invariants

- backend must stay client-agnostic
- Telegram must not own business logic
- production/deployment truth lives in Vault, not Memora source docs
