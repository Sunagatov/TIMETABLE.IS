# Local V1 Smoke Test

This is a source-repo smoke checklist. Vault owns production deployment, runtime orchestration, and production env files.

## Preconditions

- Start Mongo locally or through your existing local setup.
- Use safe local env files derived from:
  - `backend/.env.local.example`
  - `frontend/.env.local.example`
  - `telegram-bot/.env.local.example`
- Set `BACKEND_COOKIE_SECURE=false` for local HTTP browser testing.
- Use placeholder-free local values for `BACKEND_BOT_INGEST_TOKEN`, `MEMORA_OWNER_TELEGRAM_USER_ID`, `OWNER_TELEGRAM_USER_ID`, and Telegram bot tokens.
- Do not run local and production long polling with the same Telegram bot token at the same time.

## Start Local Services

```bash
cd backend
./gradlew bootRun
```

```bash
cd frontend
npm ci
npm run dev
```

```bash
cd telegram-bot
./gradlew run
```

## Text Capture Smoke

1. Send a text message to the configured development bot.
2. Confirm the bot replies: `Accepted. Processing asynchronously. Memora ID: <id>`.
3. Log in to the web app.
4. Confirm the item appears in Needs Review.
5. Approve the item.
6. Confirm it appears in Approved and no longer appears in Needs Review.

## Voice Capture Smoke

1. Send a voice note to the configured development bot.
2. Confirm the bot replies with a Memora ID.
3. If transcription API config is valid, confirm the item enters Needs Review.
4. Open the item and confirm `rawTranscript` and Telegram trace metadata are visible.

## Failure And Retry Smoke

1. Stop or deliberately misconfigure the local transcription API.
2. Send a voice note.
3. Confirm the item appears in Failures as `TRANSCRIPTION_FAILED`.
4. Confirm the bot sends a failure notification with Memora ID, failed stage, summary, and retry context.
5. Fix the transcription config.
6. Retry from Failures and confirm the item processes into Needs Review when Telegram file references remain usable.

## Auth Smoke

1. Log in with the configured local password.
2. Confirm refresh keeps the authenticated session.
3. Clear or expire the session cookie.
4. Confirm protected API calls return to login.

## Category Smoke

1. Create a 3-level category.
2. Assign an item to it during review or approved edit.
3. Confirm deleting the non-empty category is blocked.
4. Rename the category.
5. Confirm current item category values cascade and original AI category values remain visible.

## Automated Readiness Commands

Run from the repo root after code or docs changes:

```bash
cd backend && ./gradlew compileKotlin && ./gradlew test && ./gradlew build
cd ../frontend && npm ci && npm run build && npm run test:run
cd ../telegram-bot && ./gradlew clean test && ./gradlew installDist
cd .. && bash scripts/ai/check-ai-docs.sh
```
