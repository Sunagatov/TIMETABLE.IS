# Error Handling and Retry

## Failure model

Processing failures stay in the same core item model using explicit status and metadata.

## Persisted fields

- processing_status
- failure_stage
- failure_reason
- retry_count

## Retry policy

- transcription auto retry: 3 times
- AI processing auto retry: 2 times
- manual retry is available from the UI after automatic retries

## Bot failure response

Failure notification should include:

- Mindraft item ID
- failed stage
- human-readable failure summary
- retry status / retry count
- indication that the item is visible in the web app failures area
