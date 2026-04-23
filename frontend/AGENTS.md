# Frontend instructions — Memora

## Role

Frontend is the web UI for:

- login
- Needs Review
- Failures
- approved items list
- item detail/edit/review
- category tree sidebar
- search/filter/sort
- category management

## Read order

1. `AGENTS.md`
2. `.claude/generated/entrypoints.md`
3. exact frontend-related product docs needed by the task
4. start from:
   - `frontend/src/main.tsx`
   - `frontend/src/App.tsx`
   - `frontend/src/pages/NeedsReviewPage.tsx`
5. then only the frontend files directly touched by the task

## UI/UX direction

- review-first trust model
- default landing view = Needs Review
- approved items are distinct from review/failure queues
- keep interaction low-friction
- keep the UI fast and clear

## Frontend invariants

- do not mix approved items into the default review screen
- do not invent new navigation outside V1 scope
- keep search/filter/sort coherent
- keep sidebar category tree visible and useful
- preserve explicit distinction between:
  - Needs Review
  - Failures
  - Approved items

## HTTP contract rule

Once shared API client logic exists, use it consistently.

Do not duplicate request/session/error logic across feature files.

## Validation

Use the smallest relevant validation first:

- targeted frontend test
- build
- targeted route/page validation

Avoid broad unrelated scans first.
