# Error Handling and Retry

## Goal

Failures must not cause silent data loss.

## Failure areas in V1

Memora shall expose a dedicated **Failures** area in the web app.

## Failure stages

Expected failure stages include at least:

- `RECEPTION`
- `TELEGRAM_FILE_FETCH`
- `TRANSCRIPTION`
- `AI_PROCESSING`
- `PERSISTENCE`

## Failure persistence model

V1 uses the same main item table/entity with:

- status
- failure stage
- failure reason
- retry counters

## Automatic retry strategy

Initial suggested defaults:

- transcription auto retry: 3 times
- AI processing auto retry: 2 times

Both values should be configurable.

## Manual retry support

The user shall be able to manually retry failed items from the web app.

## Telegram failure message content

The bot should provide as much useful failure context as reasonably possible in V1, including at least:

- Mindraft ID
- failed stage
- human-readable failure summary
- retry count or retry state
- note that the item is visible in Failures area

## Accepted V1 limitation

Because audio is not stored by Memora, full audio-based reprocessing inside Memora is intentionally limited in V1.
