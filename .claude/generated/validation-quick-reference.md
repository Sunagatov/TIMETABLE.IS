# Validation Quick Reference

Use the smallest relevant validation first.

## Backend change

Prefer:
- targeted backend test
- narrow startup check
- feature-focused validation

Avoid broad repo scans first.

## Frontend change

Prefer:
- targeted frontend test
- build
- route/page-focused validation

Avoid unrelated frontend scans first.

## Telegram bot change

Prefer:
- smallest bot-side validation
- focused config/startup check

## Cross-cutting contract change

Validate only the affected surfaces:
- backend + frontend if API contract changed
- backend + bot if ingestion contract changed
- all three only if the task truly crosses all three
