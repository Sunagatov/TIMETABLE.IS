# Telegram bot instructions — Memora

## Role

The Telegram bot is intentionally thin.

It should:

- receive Telegram updates
- validate owner Telegram user ID
- forward accepted input to backend
- send immediate acknowledgement
- send failure notifications when backend requires it

It should not own core business logic.

## Current stack

- Python
- python-telegram-bot
- httpx

## Read order for bot work

1. `AGENTS.md`
2. `docs/03_FUNCTIONAL_REQUIREMENTS.md`
3. `docs/07_PROCESSING_PIPELINE.md`
4. `docs/08_ERROR_HANDLING_AND_RETRY.md`
5. `docs/13_ENGINEERING_PRINCIPLES.md`
6. current bot entrypoints:
   - `telegram-bot/src/memora_bot/main.py`
   - `telegram-bot/src/memora_bot/config.py`
7. then only the exact bot files needed by the task

Do **not** scan the whole repo or the whole backend/frontend when a bot-only change is enough.

## Bot invariants

- only configured owner Telegram user ID is accepted
- one Telegram message -> one item
- immediate ack includes Mindraft ID
- processing is asynchronous
- bot should stay transport-focused, not business-logic-heavy

## Bot message contract

Initial ack shape:

`Accepted. Processing asynchronously. Mindraft ID: ...`

Failure message should include useful operational information, at least:

- Mindraft ID
- failed stage
- summary
- retry context if available

## Validation

Prefer the smallest possible bot-side validation first.
