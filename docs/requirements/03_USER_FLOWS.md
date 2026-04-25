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
7. Backend downloads the Telegram voice file, prepares audio, and calls the configured OpenAI-compatible transcription service.
8. Item enters Needs Review after transcription and AI processing succeed, or Failures if bounded transcription/AI retries are exhausted.

## Flow 2 — capture text message

1. User opens Telegram bot.
2. User sends text message.
3. Bot validates owner Telegram user ID.
4. Backend accepts item and generates Memora ID.
5. Bot replies with async acknowledgement + Memora ID.
6. Backend runs AI cleanup/classification asynchronously.
7. If AI infers type `QUESTION`, AI also generates an answer.
8. Item enters Needs Review or Failures depending on outcome.

## Flow 3 — review and approve

1. User opens web app.
2. Default landing view is Needs Review.
3. User opens an item.
4. User compares original AI output and editable current values.
5. If item type is `QUESTION`, user also sees the AI-generated answer.
   - User may edit, reject/delete, or regenerate the answer before approving.
6. User either:
   - approves as is
   - edits then approves
   - rejects
   - deletes
   - retries processing
7. If AI proposed a new category path, user may approve or override it during review.

## Flow 4 — browse approved knowledge base

1. User opens main list.
2. Main list contains only human-approved items by default.
3. User searches (including answer field), filters, sorts, and opens items.
4. User may edit approved items later (human edits keep items approved automatically in V1).

## Flow 5 — failure handling

1. Item processing fails at a specific stage.
2. Failure details are persisted.
3. Bot sends failure message with useful operational context.
4. Item appears in Failures area.
5. User may retry or inspect later.

## Flow 6 — AI regeneration

1. User opens an item in Needs Review or an approved item.
2. User triggers regeneration of one or more AI outputs:
   - cleaned text
   - answer (for QUESTION items)
   - category proposal
3. Backend generates new AI output; previous AI output is preserved where practical.
4. User reviews the regenerated output and approves or discards.
