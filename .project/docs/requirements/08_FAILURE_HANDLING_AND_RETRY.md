# Failure Handling and Retry

## Goal

Failures must not silently discard accepted user input.

## Failure stages

Conceptual stages include at least:
- reception
- Telegram file fetch
- transcription
- AI processing
- persistence

## Failure persistence

Failure records should preserve:
- item ID
- stage
- reason
- retry counters / retry context
- traceability metadata

## UI visibility

Failures must appear in a dedicated Failures area.

## Retry behavior

V1 should support:
- automatic retries first
- manual retry from UI later

Suggested initial defaults:
- transcription auto retry: 3 times
- AI processing auto retry: 2 times

These values should remain configurable.

## Accepted V1 limitation

Because Memora does not store its own audio objects in V1, full audio-based retry/reprocessing is intentionally limited.
