# Non-Functional Requirements

## Security

- HTTPS is mandatory
- Telegram webhook secret validation is mandatory
- Single-user password login is required
- Backend-managed session is required
- Session lifetime default is 30 days and configurable
- Auto-redirect to login on expired/invalid session is required

## Reliability

- Drafts/items must survive failures
- Automatic retries should occur before manual retry
- Failure reason and retry counters must be persisted

## Maintainability

- Keep code simple and readable
- Prefer small files where practical
- Avoid over-engineering
- Preserve strong separation between core use cases and adapters
