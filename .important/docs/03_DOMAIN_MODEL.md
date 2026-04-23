# Domain Model

## Topic

### Fields
- `id`
- `name`
- `slug`
- `description`
- `parent_topic_id`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

### Rules
- name is required
- slug must be unique
- parent topic must be valid when provided
- deleting a topic is soft-delete
- topic deletion can be blocked if topic has active children
- deleted topics are recoverable
- a topic may be inactive without being deleted

## Word

### Fields
- `id`
- `topic_ids`
- `term`
- `past_simple`
- `past_participle`
- `translations`
- `translation_entries`
- `part_of_speech`
- `knowledge_level`
- `countability`
- `pattern`
- `example`
- `example_entries`
- `notes`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

### Derived/response fields
- `example_count`
- `example_target_count`
- `example_status`
- `needs_example_enrichment`

### Rules
- a word must belong to at least one topic on create
- duplicate word/topic combinations are not allowed
- word deletion is soft-delete
- words may be restored if restore constraints are satisfied
- active topic membership matters for restore behavior

## Knowledge levels

### Range
- minimum: 1
- maximum: 5

### Semantic meaning
- levels 1..4 = active study pool
- level 5 = parked, excluded from smart review generation

## StudyQueue

### Fields
- `id`
- `generated_at`
- `expires_at`
- `is_active`
- `total_count`
- `completed_count`

## StudyQueueItem

### Fields
- `id`
- `queue_id`
- `word_id`
- `position`
- `is_completed`
- `completed_at`

## UsageEvent

### Fields
- `event_key`
- `session_key`
- `route`
- `active_seconds`

## Important cross-entity rules

- topics can be hierarchical
- words can belong to multiple topics
- smart review operates on active, non-deleted words only
- restored words require at least one active topic
- deleted topics/words are recoverable until purged
