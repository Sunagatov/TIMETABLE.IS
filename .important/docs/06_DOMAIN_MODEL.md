# Domain Model

## Topic

### Fields
- id
- name
- slug
- description
- parent_topic_id
- is_active
- deleted_at
- created_at
- updated_at

### Rules
- topic name is required
- slug must remain unique
- parent topic must be valid
- deleting a topic with active child topics is forbidden
- deleted topics are recoverable through trash

## Word

### Fields
- id
- topic_ids
- term
- past_simple
- past_participle
- translations
- translation_entries
- part_of_speech
- knowledge_level
- countability
- pattern
- example
- example_entries
- notes
- is_active
- deleted_at
- created_at
- updated_at

### Derived/Computed fields
- example_count
- example_target_count
- example_status
- needs_example_enrichment

### Rules
- word term is required
- translations are required
- at least one topic is required on create
- duplicates must be blocked according to backend duplicate rules
- knowledge level range is 1..5
- level 5 means parked/excluded from Smart Review

## StudyQueue

### Fields
- id
- generated_at
- expires_at
- is_active
- total_count
- completed_count

## StudyQueueItem

### Fields
- id
- queue_id
- word_id
- position
- is_completed
- completed_at

## UsageEvent

### Fields
- event_key
- session_key
- route
- active_seconds

## Trash Semantics

Topics and words are soft-deleted first.
Purge is a separate hard-delete operation.
