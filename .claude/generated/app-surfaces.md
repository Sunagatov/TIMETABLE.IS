# App Surfaces

## backend/

Source of truth:
- business logic
- item lifecycle
- review workflow
- failure handling
- category tree
- auth/session
- API contracts

## frontend/

UI:
- login
- Needs Review
- Failures
- approved list
- detail/edit/review
- search/filter/sort
- sidebar category tree

## telegram-bot/

Thin adapter:
- receive Telegram updates
- validate owner
- forward to backend
- send immediate ack
- send failure notifications
