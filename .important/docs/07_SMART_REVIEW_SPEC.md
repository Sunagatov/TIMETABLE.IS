# Smart Review Specification

## Purpose

Smart review automatically generates a study queue so the user does not need to hand-pick words for every review session.

## Configuration inputs

Smart review behavior is controlled by settings including:
- enabled flag
- per-level counts for levels 1..5
- cooldown days
- max words per topic
- queue TTL in hours

## Candidate pool rules

A word is eligible when:
- `is_active = true`
- `deleted_at is null`
- `knowledge_level == target level`

## Exclusion rules

A recently completed word is excluded if it falls inside the configured cooldown window.

## Topic balancing rule

Selection uses a deterministic primary-topic key and applies a max-per-topic cap to avoid a queue being dominated by one topic.

## Queue generation rules

1. Build level buckets from configured counts.
2. For each level, pick words not excluded by cooldown or already selected.
3. Retry once for shortfall with expanded exclusion set.
4. Shuffle final selection.
5. Deactivate prior active queues.
6. Create new queue with:
   - `generated_at`
   - `expires_at`
   - `is_active = true`
   - `total_count`
   - `completed_count = 0`
7. Create queue items in order positions.

## Active queue retrieval rules

When requesting the active queue:
- if smart review is disabled: return unavailable error
- if no active queue exists: generate one
- if active queue has zero items but candidates exist: generate one
- if active queue is stale because referenced words became invalid: regenerate
- if active queue is fully completed: regenerate
- else return active queue

## Completion rules

Completing a queue item:
- requires item to exist
- requires queue to exist and be active
- requires queue not expired
- requires referenced word to remain active and non-deleted
- marks item complete only once
- increments completed count only on first completion

## Important product implication

Level 5 is “parked”. If configuration count for level 5 is zero, parked words stay out of review. Even if non-zero, parked words are a distinct, intentional bucket rather than normal active study vocabulary.
