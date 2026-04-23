# Implementation Order

## Goal

Give Claude CLI and Codex CLI a stable, low-ambiguity implementation path.

## Recommended order

### Phase 1 — backend foundation

1. establish package structure
2. define core enums and item model
3. define status transitions
4. define category tree model
5. add simple auth/session skeleton
6. add persistence skeleton

### Phase 2 — Telegram ingestion path

1. create thin bot adapter
2. forward accepted messages to backend
3. create item + Mindraft ID
4. send immediate acknowledgement
5. persist Telegram references

### Phase 3 — processing pipeline

1. add asynchronous processing orchestration
2. add transcription integration
3. add AI cleanup/classification integration
4. add retry/failure handling
5. move items into Needs Review or Failures

### Phase 4 — frontend review UI

1. login screen
2. app shell
3. Needs Review page
4. Failures page
5. approved items list
6. item detail page
7. edit + approve flow

### Phase 5 — category management + search/filter/sort

1. category CRUD within V1 scope
2. keyword search
3. filters
4. sorting
5. sidebar tree with counts

## Important rule

Do not jump ahead to advanced features before the current phase is stable.
