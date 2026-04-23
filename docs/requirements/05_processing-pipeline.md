# Processing Pipeline

## Intended V1 target

1. Telegram message accepted
2. stable item id generated
3. item persisted
4. text and voice content processed asynchronously
5. AI-cleaned output and inferred metadata created
6. item routed into review queue
7. human review decides whether the item becomes approved knowledge

## Current starter reality

The current runnable starter implements:

- accepted text ingest
- accepted voice metadata ingest
- stable item id generation
- simple normalization/inference starter logic
- review/failure/approved query endpoints

The full transcription and AI integration slices are intentionally still future implementation tasks.
