# User Flows

## Flow 1 — capture voice note

1. User opens Telegram bot.
2. User records and sends a voice message.
3. Bot validates sender user ID.
4. Backend creates a new item and generates Memora ID.
5. Bot replies:
   - accepted
   - processing asynchronously
   - Memora ID
6. Backend retrieves the Telegram file.
7. Backend transcribes the voice message.
8. Backend stores raw transcript.
9. Backend calls AI cleanup/classification pipeline.
10. Backend stores AI output.
11. Item is placed in **Needs Review**.
12. User later opens web app and reviews the item.

## Flow 2 — capture text note

1. User opens Telegram bot.
2. User sends a text message.
3. Bot validates sender user ID.
4. Backend creates a new item and generates Memora ID.
5. Bot replies with accepted + asynchronous + Memora ID.
6. Backend stores raw input text.
7. Backend calls AI cleanup/classification pipeline.
8. Backend stores AI output.
9. Item is placed in **Needs Review**.
10. User later reviews it in web app.

## Flow 3 — approve item as is

1. User opens web app.
2. Default page shows **Needs Review**.
3. User opens an item.
4. User compares AI output and current values.
5. User clicks **Approve**.
6. Item status becomes `HUMAN_APPROVED`.
7. Item appears in the main approved list.

## Flow 4 — edit then approve

1. User opens item in **Needs Review**.
2. User edits fields such as:
   - title
   - cleaned text
   - type
   - category path
   - priority
3. User clicks **Approve**.
4. Item status becomes `HUMAN_EDITED_APPROVED`.
5. Item joins the main approved list.

## Flow 5 — reject item

1. User opens item in **Needs Review**.
2. User decides it should not enter the approved knowledge base.
3. User clicks **Reject**.
4. Item status becomes `REJECTED`.
5. Item remains in the system but not in main approved list.

## Flow 6 — delete item

1. User opens item from review or approved area.
2. User clicks **Delete**.
3. Item moves to trash-like deleted state.
4. Item no longer appears in the default approved list.

## Flow 7 — processing failure

1. User sends voice or text message.
2. Bot accepts message and returns Memora ID.
3. Processing fails at a defined stage.
4. Backend records failure details.
5. Item moves to **Failures** area.
6. Bot sends failure notification with useful details.
7. User later retries or edits from the web app.
