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
- in-memory starter persistence for runnable bootstrap
- MongoDB-targeted persistence model in docs and structure

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
- AI-generated new categories
- question-answering flow
- full voice transcription pipeline implementation
- media storage in Memora repo/app runtime
