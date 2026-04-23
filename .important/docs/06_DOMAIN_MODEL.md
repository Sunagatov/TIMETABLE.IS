# Domain Model

## Main entity: Item

### Core identity

- `id`
- `mindraft_id`
- `source_type`
- `created_at`
- `updated_at`

### Source metadata

- `telegram_user_id`
- `telegram_chat_id`
- `telegram_message_id`
- `telegram_file_id` (nullable for text items)
- `telegram_file_unique_id` (nullable for text items)

### Raw content

- `raw_input_text` (nullable, for text source)
- `raw_transcript` (nullable, for voice source)

### AI-generated / processed content

- `ai_title`
- `ai_cleaned_text`
- `ai_type`
- `ai_category`
- `ai_subcategory`
- `ai_subsubcategory`
- `ai_priority`

### Current human-visible content

- `title`
- `cleaned_text`
- `type`
- `category`
- `subcategory`
- `subsubcategory`
- `priority`

### Review and lifecycle

- `status`
- `failure_stage`
- `failure_reason`
- `retry_count_transcription`
- `retry_count_ai`
- `approved_at`
- `deleted_at`
- `rejected_at`

### Version traceability

- `original_ai_output_snapshot`
- `latest_human_version_snapshot`

## Type enum (V1)

- `IDEA`
- `THOUGHT`
- `REMINDER`
- `OTHER`

## Status enum (V1)

- `RECEIVED`
- `TRANSCRIPTION_FAILED`
- `TRANSCRIBED`
- `AI_PROCESSING_FAILED`
- `AI_PROCESSED_UNREVIEWED`
- `HUMAN_APPROVED`
- `HUMAN_EDITED_APPROVED`
- `REJECTED`
- `DELETED`

## Priority enum (V1)

- `URGENT_IMPORTANT`
- `URGENT_NOT_IMPORTANT`
- `NOT_URGENT_IMPORTANT`
- `NOT_URGENT_NOT_IMPORTANT`
- `NOT_APPLICABLE`

## Important modeling rule

Type and category must stay separate:

- `TYPE` answers “what kind of item is this?”
- `CATEGORY TREE` answers “what topic does this belong to?”
