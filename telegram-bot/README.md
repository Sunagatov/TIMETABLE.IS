# Telegram Bot

This folder contains the Memora Telegram bot adapter.

## Role

The bot is intentionally thin.

It should:

- receive Telegram updates
- validate sender user ID
- forward accepted input to backend
- send immediate acknowledgement
- send failure notifications when backend requests them

It should not own core business logic.
