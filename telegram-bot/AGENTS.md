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

## Read order

1. `AGENTS.md`
2. `.claude/generated/entrypoints.md`
3. exact bot-related product docs needed by the task
4. start from:
   - `telegram-bot/src/memora_bot/config.py`
   - `telegram-bot/src/memora_bot/main.py`
5. then only the exact bot files needed by the task

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
