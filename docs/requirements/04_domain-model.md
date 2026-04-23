# Domain Model

## Main entity: Item

### Identity

- `id`
- `mindraftId`
- `sourceType`
- `createdAt`
- `updatedAt`

### Telegram metadata

- `telegramUserId`
- `telegramChatId`
- `telegramMessageId`
- `telegramFileId`
- `telegramFileUniqueId`

### Raw content

- `rawInputText`
- `rawTranscript`

### AI output snapshot

- `aiTitle`
- `aiCleanedText`
- `aiType`
- `aiCategory`
- `aiSubcategory`
- `aiSubsubcategory`
- `aiPriority`

### Current editable values

- `title`
- `cleanedText`
- `type`
- `category`
- `subcategory`
- `subsubcategory`
- `priority`

### Lifecycle

- `status`
- `failureStage`
- `failureReason`
- `retryCountTranscription`
- `retryCountAi`
- `approvedAt`
- `deletedAt`
- `rejectedAt`

## Type enum

- `IDEA`
- `THOUGHT`
- `REMINDER`
- `OTHER`

## Status enum

- `RECEIVED`
- `TRANSCRIPTION_FAILED`
- `TRANSCRIBED`
- `AI_PROCESSING_FAILED`
- `AI_PROCESSED_UNREVIEWED`
- `HUMAN_APPROVED`
- `HUMAN_EDITED_APPROVED`
- `REJECTED`
- `DELETED`

## Priority enum

- `URGENT_IMPORTANT`
- `URGENT_NOT_IMPORTANT`
- `NOT_URGENT_IMPORTANT`
- `NOT_URGENT_NOT_IMPORTANT`
- `NOT_APPLICABLE`

## Important invariant

Type and category must stay separate.

- type = what kind of item it is
- category tree = what topic it belongs to
