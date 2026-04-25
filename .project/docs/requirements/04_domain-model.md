# Domain Model

## Primary domains / areas

### auth
- session login
- session validation
- logout

### capture
- Telegram ingest
- acceptance id generation
- initial item creation

### item
- item identity
- source metadata
- current content
- status
- category path
- priority

### review
- needs review
- failures
- approved items
- approve/reject/delete transitions

## Item shape

Starter item model includes:
- internal id
- stable memora item id
- source type
- Telegram metadata
- raw input text
- raw transcript
- AI-generated title
- AI-generated cleaned text
- AI-generated type/category/priority
- current human-visible title/text/type/category/priority
- status
- retry counters
- timestamps

## Item status

Starter status set:
- RECEIVED
- TRANSCRIPTION_FAILED
- TRANSCRIBED
- AI_PROCESSING_FAILED
- AI_PROCESSED_UNREVIEWED
- HUMAN_APPROVED
- HUMAN_EDITED_APPROVED
- REJECTED
- DELETED

## Item type

Starter type set:
- IDEA
- THOUGHT
- REMINDER
- OTHER
