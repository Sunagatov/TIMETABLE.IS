# Configuration and Environment

## Core app config
- `APP_HOST`
- `APP_PORT`
- `APP_DEBUG`

## Database
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`

## Auth/security
- `APP_PASSWORD`
- `SECRET_KEY`
- `COOKIE_MAX_AGE`
- `COOKIE_HTTPONLY`
- `COOKIE_SECURE`
- `COOKIE_SAMESITE`
- `API_KEY`

## Smart review
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

## Frontend build-time config
- `VITE_API_BASE_URL`
- `VITE_PAGE_SIZES`
- `VITE_DEFAULT_PAGE_SIZE`

## Important requirement for AI agents
Agents must preserve config-driven behavior. Hardcoding these values into business logic is not acceptable.
