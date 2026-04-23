# Configuration and Environment

## Core application
- `APP_HOST`
- `APP_PORT`
- `APP_DEBUG`

## Database
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`

## Owner auth / security
- `APP_PASSWORD`
- `SECRET_KEY`
- `COOKIE_MAX_AGE`
- `COOKIE_HTTPONLY`
- `COOKIE_SECURE`
- `COOKIE_SAMESITE`
- `API_KEY`

## Smart Review
- `SMART_REVIEW_ENABLED`
- `SMART_REVIEW_LEVEL_1_COUNT`
- `SMART_REVIEW_LEVEL_2_COUNT`
- `SMART_REVIEW_LEVEL_3_COUNT`
- `SMART_REVIEW_LEVEL_4_COUNT`
- `SMART_REVIEW_LEVEL_5_COUNT`
- `SMART_REVIEW_COOLDOWN_DAYS`
- `SMART_REVIEW_MAX_PER_TOPIC`
- `SMART_REVIEW_QUEUE_TTL_HOURS`

## Trash
- `TRASH_RETENTION_DAYS`

## AI
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

## CORS
- `CORS_ALLOWED_ORIGINS` behavior must remain documented and environment-driven.

## Documentation requirement
Every env var above must have:
- default or required status
- purpose
- production guidance where relevant
