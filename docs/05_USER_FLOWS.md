# User Flows

## Telegram capture flow

1. User sends text or voice message to bot
2. Bot verifies allowed Telegram user
3. Bot creates/forwards work to backend
4. Bot replies: Accepted. Processing asynchronously. Memora ID: ...
5. Backend processes asynchronously
6. Item lands in Needs Review or Failures

## Review flow

1. User logs in to web app
2. Default landing page shows Needs Review
3. User opens item and sees original/raw data plus latest processed version
4. User edits, approves, rejects, deletes, or retries
5. Approved item becomes visible in main list
