# API Surface (Requirement-Level, Not Final Code)

This file is intentionally high-level and requirement-driven.

It exists to help agents reason about likely backend boundaries without inventing implementation details too early.

## Authentication
Expected V1 capabilities:
- login
- logout
- session validation

## Capture ingestion
Expected V1 capabilities:
- accept Telegram text message payload
- accept Telegram voice metadata payload
- generate Memora item ID
- persist accepted item
- enqueue or trigger async processing

## Review
Expected V1 capabilities:
- list Needs Review items
- list Failures
- list approved items
- fetch item detail
- approve item
- edit then approve
- reject item
- delete item
- retry processing

## Category management
Expected V1 capabilities:
- list categories
- create category
- rename category
- delete empty category
- move item/category assignments where needed

## Search/filter/sort
Expected V1 capabilities:
- keyword search
- filter by type/status/category/path/priority/date
- sort by title/category/date

## Important warning

This is not a final endpoint list.

If implementation starts, source-of-truth behavior is still `docs/requirements/`.
