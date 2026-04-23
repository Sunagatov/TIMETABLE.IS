# Telegram Bot

The Telegram bot is a thin adapter.

## Responsibilities

- Accept updates only from the configured Telegram user ID
- Verify webhook secret
- Forward accepted messages to backend
- Return immediate acknowledgement with a stable Memora item ID
- Return failure notifications with useful processing context

## Non-responsibilities

- Core business logic
- Direct DB ownership
- Approval/review state management
