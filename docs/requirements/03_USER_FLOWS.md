# User Flows

## Flow 1 — capture voice message

1. User opens Telegram bot.
2. User sends voice message.
3. Bot validates owner Telegram user ID.
4. Backend accepts item and generates Memora ID.
5. Bot replies:
   - accepted
   - processing asynchronously
   - Memora ID
6. Backend persists voice traceability metadata and processes asynchronously.
7. Current bootstrap routes voice items to visible retryable transcription failure after bounded retries because the transcription slice is not implemented yet.
8. Item enters Needs Review or Failures depending on outcome once the full voice pipeline exists.

## Flow 2 — capture text message

1. User opens Telegram bot.
2. User sends text message.
3. Bot validates owner Telegram user ID.
4. Backend accepts item and generates Memora ID.
5. Bot replies with async acknowledgement + Memora ID.
6. Backend runs AI cleanup/classification asynchronously.
7. Item enters Needs Review or Failures depending on outcome.

## Flow 3 — review and approve

1. User opens web app.
2. Default landing view is Needs Review.
3. User opens an item.
4. User compares original AI output and editable current values.
5. User either:
   - approves as is
   - edits then approves
   - rejects
   - deletes
   - retries processing

## Flow 4 — browse approved knowledge base

1. User opens main list.
2. Main list contains only human-approved items by default.
3. User searches, filters, sorts, and opens items.
4. User may edit approved items later.

## Flow 5 — failure handling

1. Item processing fails at a specific stage.
2. Failure details are persisted.
3. Bot sends failure message with useful operational context.
4. Item appears in Failures area.
5. User may retry or inspect later.
