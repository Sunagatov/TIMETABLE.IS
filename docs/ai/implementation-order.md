# Implementation Order

## Recommended order

### Phase 1 — backend foundation

- enums
- item model
- status transitions
- auth/session skeleton
- in-memory store first
- telegram ingest endpoint
- review list endpoints

### Phase 2 — frontend shell

- login page
- app shell
- needs review page
- failures page
- approved items page
- API client

### Phase 3 — telegram bot adapter

- owner user validation
- backend forwarder
- accepted message
- failure message

### Phase 4 — persistence upgrade

- replace in-memory item storage with MongoDB persistence
- keep API shape stable
