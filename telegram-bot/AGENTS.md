# Telegram bot instructions — Memora

## Role

The Telegram bot is intentionally thin.

It should:
- receive Telegram updates
- validate owner Telegram user ID
- forward accepted input to backend
- send immediate acknowledgement
- send failure notifications when backend requires them

It should not own core business logic.

## Confirmed implementation hint

The current repository already contains Python-based bot code.

That implementation detail must not become an excuse to push product logic into the bot.

## Read order

1. `AGENTS.md`
2. `docs/requirements/README.md`
3. exact relevant requirement file(s)
4. start from:
   - `telegram-bot/src/memora_bot/config.py`
   - `telegram-bot/src/memora_bot/main.py`
5. then only the exact bot files needed

## Bot invariants

- only configured owner Telegram user ID is accepted
- one Telegram message -> one item
- immediate acknowledgement includes Memora item ID
- processing is asynchronous
- bot stays transport-focused
- backend remains source of truth

## Bot message contract

Initial acknowledgement shape:

`Accepted. Processing asynchronously. Memora ID: ...`

Failure message should contain useful operational information, at least:
- Memora ID
- failed stage
- summary
- retry context if available

## V1 limitation reminders

- do not assume Memora stores audio itself
- bot may rely on Telegram references/IDs for traceability
- question-answering workflow is not part of initial V1 MVP

## Production/runtime boundary

Bot deployment/runtime truth is not fully defined in this repo.

For production bot runtime/deployment behavior, check Vault docs first.

## Validation

Prefer the smallest possible bot-side validation first.
