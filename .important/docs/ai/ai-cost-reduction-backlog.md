# AI cost-reduction backlog for Memora

This backlog is specific to Memora’s current **topic-suggestion** flow.

It is not a generic “AI best practices” note.  
It exists to improve **this repo’s** actual token spend, latency, and reliability.

---

## Current baseline problem

The current implementation effectively sends:

- a system prompt
- the word and translation
- the **full active topic list**

on every suggestion request.

That is acceptable for a small topic catalog, but it creates predictable scaling pain:

- token growth
- latency growth
- higher timeout risk
- noisier outputs as topic count grows
- higher cost per suggestion

---

## Durable Memora rules

These rules have repeatedly mattered in later Memora work and should be treated as defaults.

### Enrichment rules

- export from prod only
- use lean exports
- use `needs_examples_only=true` when only unfinished words matter
- 3 natural English examples per word is the completion threshold
- skip already-complete words
- prefer stable IDs and compact payloads over large text blobs
- keep examples natural, not templated
- prefer model-written examples over deterministic filler
- do not introduce deterministic template generators unless explicitly requested

### Topic-splitting rules

- split only topics larger than 300 active words
- skip part-of-speech umbrella topics for now
- keep umbrella topics intact
- split only when new buckets are clearly narrower and easy to explain
- reuse an existing topic when it already fits well
- prefer fewer, broader subtopics over many overlapping siblings
- dry-run before live import
- spot-check before live import when split plans are large or newly tuned

### Ops hygiene rules

- Vault is the source of truth for prod operations
- do not use stale scripts outside the maintained workflow
- local DB exports must not be used for prod imports
- generated curation artifacts should stay under the intended artifacts area
- migration/prepared-statement issues should be fixed at config/connection level, not bypassed by repeated deploy retries

---

## Priority 0 — highest ROI

### 1. Return a tiny structured answer

**Idea:** ask the model to return a stable topic ID or numbered candidate index instead of a full topic name.

**Why it helps**
- fewer output tokens
- less formatting drift
- easier validation
- easier parsing

**Implementation direction**
- build a numbered candidate list
- ask the model to return only the number/index
- reduce output budget aggressively

**Expected impact**
- fast to implement
- immediate token savings
- simpler parsing

---

### 2. Add normalized request-result caching

**Idea:** cache by normalized `(term, translation, topic_catalog_version)`.

**Why it helps**
- repeated suggestions become nearly free
- common words return faster
- upstream model calls drop

**Implementation direction**
- normalize case and whitespace
- include a catalog version/hash
- invalidate when topic set changes
- use TTL only as a complement, not the whole invalidation strategy

---

### 3. Short-circuit obvious matches before the model

**Idea:** skip the model when deterministic logic is already strong enough.

**Examples**
- exact term seen before
- exact translation seen before
- strong known synonym mapping
- only one active topic exists

**Why it helps**
- zero model tokens for easy cases
- lower latency
- lower upstream risk

---

### 4. Reduce candidate topics before prompting

**Idea:** shortlist topics first, then ask the model to choose from a much smaller set.

**Cheap shortlist options**
- lexical similarity on topic names
- prior topic history for same/similar word
- keyword dictionaries
- alias lists
- frequency/history hints

**Why it helps**
- smaller prompt
- less ambiguity
- lower model confusion

---

### 5. Lower `max_tokens`

The current budget is too generous for one-label classification.

**Suggested direction**
- `4` when returning numeric/index output
- `6–8` when returning exact label output

**Why it helps**
- immediate cost reduction
- less verbose garbage
- easier validation

---

## Priority 1 — strong next steps

### 6. Batch suggestion endpoint for imports

Useful when many words are added together.

### 7. Lightweight observability

Track:
- request count
- cache hit rate
- candidate count
- latency
- timeout count
- invalid model responses
- fallback usage

### 8. Confidence tiers

Split into:
- deterministic high-confidence path
- cheap-model medium-confidence path
- manual fallback low-confidence path

### 9. Per-topic aliases / keywords

Improves shortlisting without huge prompts.

---

## Priority 2 — more advanced

### 10. Embedding-based preselection

Potentially useful once topic count grows much more.

### 11. Evaluation harness

Build a gold dataset and track:
- accuracy
- average candidate count
- average latency
- cache hit rate
- cost per 100 suggestions

### 12. Provider/model fallback ladder

Possible future ladder:
1. deterministic rules
2. cheap classifier model
3. stronger fallback only for ambiguous misses

---

## Recommended implementation order

1. tiny structured output
2. lower `max_tokens`
3. caching
4. deterministic shortcuts
5. candidate shortlisting
6. metrics
7. batching
8. evaluation harness

---

## Acceptance criteria for a good first optimisation pass

A strong first pass should improve most of these:

- fewer input tokens per request
- fewer output tokens per request
- lower average latency
- same or better suggestion success rate
- fewer timeouts
- fewer invalid responses
- high cache hit rate on repeated requests
- readable logs for failure analysis

---

## What not to do

Avoid these anti-patterns:

- replacing a simple path with a complex framework too early
- adding embeddings before fixing prompt bloat
- keeping large free-text outputs for a one-label task
- optimising blindly without metrics
- mixing unrelated AI refactors into topic-suggestion work
