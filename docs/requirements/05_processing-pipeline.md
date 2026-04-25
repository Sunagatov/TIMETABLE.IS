# Processing Pipeline

## Intended V1 target

1. Telegram message accepted
2. stable item id generated
3. item persisted
4. text and voice content processed asynchronously
5. AI-cleaned output and inferred metadata created
6. item routed into review queue
7. human review decides whether the item becomes approved knowledge

## Current V1 reality

The current runnable backend implements:

- accepted text ingest
- accepted voice metadata ingest with backend-owned Telegram download and transcription
- stable item id generation
- backend-owned in-process async processing for accepted text and voice items
- lightweight normalization/inference starter logic
- voice transcription through an OpenAI-compatible transcription endpoint, with visible retryable failure after bounded automatic attempts
- review/failure/approved query endpoints
- deterministic text AI by default, with optional OpenAI-compatible text AI mode
