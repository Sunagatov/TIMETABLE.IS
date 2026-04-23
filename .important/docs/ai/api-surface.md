# Confirmed API surface

This file lists **confirmed** routes and route groups based on current inspected documentation.

It is intentionally conservative:
- confirmed is better than guessed
- incomplete is better than speculative

If a task needs full certainty for a specific route, inspect the exact router file.

---

## Auth

### `POST /auth/login`

Purpose:
- password login

Success contract:
- returns `{ ok: true, csrf_token: string }`
- sets `session` cookie

### `POST /auth/logout`

Purpose:
- logs out active session

Success contract:
- returns `{ ok: true }`
- deletes `session` cookie

---

## Topics

### `GET /api/topics`
Returns all topics.

### `GET /api/topics/{topic_id}`
Returns one topic or `404`.

### `POST /api/topics`
Creates a topic.

Known errors:
- `400` invalid topic name
- `409` slug conflict

### `PUT /api/topics/{topic_id}`
Updates a topic.

Known errors:
- `404` topic not found
- `400` invalid topic name
- `409` slug conflict

### `DELETE /api/topics/{topic_id}?delete_words={bool}`
Soft-deletes a topic.

Important note:
- topic-delete correctness depends on remaining **active** memberships, not raw counts

---

## Words

### `GET /api/words`

Known query params:
- `topic_id` (optional, positive int)
- `search` (optional, min length 1)

### `GET /api/words/{word_id}`
Returns one word or `404`.

### `POST /api/words`
Creates a word.

Known errors:
- `400` missing topics
- `409` duplicate word in topic

### `PUT /api/words/{word_id}`
Updates a word.

Known errors:
- `404` word not found
- `400` missing topics
- `409` duplicate word in topic

### `DELETE /api/words/{word_id}`
Soft-deletes a word.

### `POST /api/words/bulk`
Bulk create/import words.

Additional protection:
- `X-Api-Key`

Known errors:
- `400` invalid topic name for slug generation
- `409` topic exists in trash
- `409` slug conflict

### `POST /api/words/suggest-topic`
Suggests a topic for a word + translation.

Known errors include:
- `503` AI not configured
- `404` no topics found
- `422` AI returned unknown topic
- `504` AI timeout
- `502` upstream AI HTTP / connection failures

---

## Smart review

### `GET /api/smart-review`
Returns active queue or `503` when disabled.

### `POST /api/smart-review/refresh`
Regenerates queue or `503` when disabled.

### `POST /api/smart-review/items/{item_id}/complete`
Completes a queue item.

Known errors:
- `404` queue item not found
- `404` queue inactive or missing

---

## AI curation

Confirmed from docs and workflow references:

### `GET /api/ai-curation/topics`
List topics for curation.

### `GET /api/ai-curation/topics/{topic_id}/export`
Exports topic words.

Common query modes:
- full export
- `lean=true`
- `needs_examples_only=true`
- paginated access

### `POST /api/ai-curation/import`
Dry-run or live import.

Important:
- dry-run uses full validation logic without committing
- live import commits changes
- import payload semantics are part of a stable operational workflow

---

## Also mounted / known router groups

The app wiring confirms these groups exist:

- health
- trash
- stats

Inspect exact router files before changing those areas.

---

## Auth contract reminder

Protected routes generally rely on:

- session cookie
- `X-CSRF-Token`

Do not propose alternate request patterns unless the task is explicitly about auth redesign.

---

## Import contract reminder

Important stable import behaviors:

- prefer exported topic IDs over names
- `example_entries: []` means explicit clear
- bulk imports should remain atomic
- duplicate active topic names are invalid even if slugs differ

---

## What not to assume

Do not assume:

- undocumented routes exist
- DTO shapes match old memory
- query params exist just because a similar feature often has them
- trash/stats contract details without opening the real files

This document is a starting surface, not a replacement for exact router inspection when precision matters.
