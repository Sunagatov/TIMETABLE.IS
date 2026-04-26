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
- For real local Memora AI polishing, set `MEMORA_AI_MODE=openai`; deterministic mode is only a local/dev/test fallback.
- If you want production-like startup safety locally, also set `MEMORA_VALIDATE_PRODUCTION_CONFIG=true` and `MEMORA_AI_FALLBACK_TO_DETERMINISTIC=false`.
- With production validation enabled, expect backend startup to fail clearly if AI mode is deterministic or AI key/base URL/model is blank.
- Do not run local and production long polling with the same Telegram bot token at the same time.

## Start Local Services

```bash
cd ../Vault/apps/memora/backend
task local:doctor
task local:whisper:tunnel
task local:run
```

```bash
cd ../Vault/apps/memora/frontend
task local:run
```

```bash
cd ../Vault/apps/memora/telegrambot
task local:run
```

Notes:
- `task local:run` is the preferred entrypoint because it resolves the source repo, loads local env, and avoids shell/bootstrap drift that raw commands can miss.
- For backend-only debugging, raw `./gradlew bootRun` is still valid if and only if `backend/.env.local` is loaded explicitly first.
- Keep the Whisper tunnel terminal open while testing local voice notes.

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
4. Open the item and confirm the cleaned text is primary, with transcript/source details available only after expanding the disclosure.

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
5. If login fails on local HTTP, verify `BACKEND_COOKIE_SECURE=false` and that the backend process actually loaded `backend/.env.local`.

## Category Smoke

1. Create a 2-level category.
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
cd .. && bash .project/scripts/ai/check-ai-docs.sh
```
