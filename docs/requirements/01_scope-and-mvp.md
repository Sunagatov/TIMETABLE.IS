# Scope and MVP

## In scope for initial V1 MVP

### Capture
- Telegram text capture
- Telegram voice capture
- single-user bot access
- async acknowledgement with stable item id

### Backend
- client-agnostic source-of-truth backend
- auth/session endpoints
- Telegram ingest endpoint
- review queues
- approved items list
- MongoDB persistence for active runtime
- in-memory stores only for focused tests or explicitly configured local development

### Frontend
- password login screen
- review workspace
- failures workspace
- approved items workspace
- simple search/filter/sort placeholders
- category sidebar placeholder

### Telegram bot
- thin Kotlin adapter
- owner-only access
- forwards accepted messages to backend
- `/start` support
- acceptance and failure messaging

## Out of scope for initial MVP
- multi-user support
- deployment/runtime files in this repo
- semantic search
- labels
- media storage in Memora repo/app runtime
