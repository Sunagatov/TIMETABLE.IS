# AI curation workflow

This file documents the **current safe workflow** for enriching topic words and importing results back into Memora.

It is written for both humans and coding agents.

Its main goals are:

- safe prod-first enrichment
- compact payloads
- predictable dry-run/live import flow
- clear import guardrails
- low-token AI work

---

## What this workflow is for

Use this workflow when you want to:

- add example sentences to existing words
- create new words in a topic
- reassign words across topics
- prepare safe topic split imports
- run enrichment or split tasks with review-first discipline

---

## Core principle

**Always export from prod for prod imports.**

Do not use local DB exports for prod imports. IDs differ across environments.

This is one of the most important Memora operational rules.

---

## Endpoints

| Purpose | Method | Path |
|---|---|---|
| List all topics | GET | `/api/ai-curation/topics` |
| Export topic words (full) | GET | `/api/ai-curation/topics/{topic_id}/export?page=1&page_size=100` |
| Export topic words (lean) | GET | `/api/ai-curation/topics/{topic_id}/export?lean=true&needs_examples_only=true&page=1&page_size=100` |
| Dry run / live import | POST | `/api/ai-curation/import` |

Auth: session cookie + `X-CSRF-Token`.

---

## Default workflow

### Step 1 — log in against prod

Example shape:

```bash
curl -s -c cookies.txt -X POST https://Memora.zuf.uk/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"<prod-password>"}'
```

Capture the returned `csrf_token`.

### Step 2 — list topics

Use `GET /api/ai-curation/topics` to find the target `topic_id`.

### Step 3 — export the target topic

Prefer the **lean** export unless you specifically need full data.

Why:
- less payload
- fewer tokens
- fewer hallucinations
- easier enrichment prompts

Preferred export modes:

- lean export for general enrichment
- `needs_examples_only=true` when only incomplete words matter

### Step 4 — enrich outside or inside the workflow

Use the exported JSON with the approved curation prompt/process.

### Step 5 — dry run import

Dry run must happen before live import.

Why:
- validates IDs and topic refs
- catches stale payload problems
- confirms counts
- writes nothing to DB

### Step 6 — review results

Check:
- updated count
- created count
- unchanged count
- sample outputs for plausibility

### Step 7 — run live import

Only after dry-run results look correct.

---

## Practical enrichment rules

These rules are durable defaults for Memora.

- 3 natural English examples per word is the default completion threshold
- if a word already has 3 strong examples, skip it
- replace examples only when they are weak, repetitive, templated, or unnatural
- keep example level around B1-C1
- use the target word or phrase naturally
- prefer model-written examples over deterministic filler
- do not rewrite already-good examples just to force uniform counts
- keep many-to-many topic membership intact when a word belongs in multiple topics

---

## Import guardrails

Stable import rules:

- exported `topic_id` is the primary identity when present
- topic-name fallback is only for missing metadata cases
- `example_entries: []` means explicit clear
- bulk imports should remain atomic
- duplicate active topic names are invalid even if slugs differ
- if a split plan becomes fuzzy, keep the umbrella topic instead of forcing weak child topics

---

## Import payload shape (v2)

Three separate arrays replace older mixed operation styles:

- `word_updates`
- `word_creates`
- `word_reassigns`

### Sparse updates example

```json
{
  "schema_version": "Memora.ai-curation.v2",
  "source_topic_id": 6,
  "exported_at": "<copy from export>",
  "dry_run": true,
  "word_updates": [
    {"id": 2662, "example_entries": ["...", "...", "..."]},
    {"id": 2701, "example_entries": ["...", "...", "..."]}
  ]
}
```

Only send fields that actually change.

### Word creation example

```json
{
  "schema_version": "Memora.ai-curation.v2",
  "source_topic_id": 6,
  "dry_run": true,
  "word_creates": [
    {
      "target_topic_refs": [{"topic_id": 6}],
      "term": "otter",
      "translations": "выдра",
      "part_of_speech": "noun",
      "countability": "countable",
      "example_entries": ["...", "...", "..."]
    }
  ]
}
```

### Topic reassignment example

```json
{
  "word_reassigns": [
    {
      "id": 2662,
      "add_topic_refs": [{"topic_id": 7}],
      "remove_topic_ids": [6]
    }
  ]
}
```

---

## Automated enrichment path

Automated enrichment exists to reduce manual copy-paste.

Typical shape:

```bash
cd backend

PROD_PASSWORD=xxx ANTHROPIC_API_KEY=xxx \
../.venv/bin/python -m app.scripts.enrich_examples --topic-id 6 --dry-run
```

Live run:

```bash
PROD_PASSWORD=xxx ANTHROPIC_API_KEY=xxx \
../.venv/bin/python -m app.scripts.enrich_examples --topic-id 6 --live
```

Resume example:

```bash
PROD_PASSWORD=xxx ANTHROPIC_API_KEY=xxx \
../.venv/bin/python -m app.scripts.enrich_examples --topic-id 6 --live --start-page 4
```

If provider fallback is needed, switch provider/model explicitly rather than guessing.

---

## Topic splitting workflow

Use the split workflow when a topic is too broad and the new structure is clearly better.

### Split only when these are true

- topic has more than 300 active words
- proposed subtopics are materially narrower
- boundaries are explainable
- sibling topics are not near-duplicates
- the result is easier for a human to maintain

### Do not split these by default

Skip part-of-speech umbrella topics for now, including:

- Verbs
- Nouns
- Adjectives
- Adverbs
- Phrases
- Prepositions
- Irregular Verbs

### Keep umbrella topics

If the split is useful, keep the broad topic as umbrella where appropriate.

Use child topics via `parent_topic_id`.

### When not to split

Do **not** split when:

- boundaries overlap heavily
- resulting names are too similar
- buckets are hard to explain
- the hierarchy becomes noisier rather than clearer

### Split workflow summary

1. inspect topic audit
2. export real prod data
3. create split plan
4. dry-run import
5. spot-check sample
6. live import only after review

### Spot-check rule

When the split plan is newly tuned or large:
- review 10–15 proposed entries before live import

---

## Service locations

Main locations relevant to this workflow:

- `backend/app/features/words/ai_curation/`
- `backend/app/scripts/enrich_examples.py`
- split-related scripts and artifact directories used by the current project workflow

---

## What not to do

- do not import prod changes from local export IDs
- do not skip dry-run
- do not auto-delete umbrella topics during initial split
- do not force weak subtopics
- do not create many near-duplicate sibling topics
- do not treat deterministic filler examples as good enough by default
