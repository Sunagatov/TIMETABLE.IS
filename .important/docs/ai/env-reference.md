# Environment and configuration reference

This file is a compact operator view for Memora.

Its job is not to duplicate every setting definition.  
Its job is to tell the agent or human **what configuration themes exist and where to look first**.

---

## Primary source of truth

Backend configuration is defined in:

- `backend/app/shared/config.py`

That file should be checked before proposing code changes for behavior that may actually be config-driven.

---

## Main backend config themes

### Database

Typical values include:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`

Use this group when diagnosing:
- startup failures
- connection issues
- migration issues
- wrong environment targets

### App runtime

Typical values include:

- `APP_HOST`
- `APP_PORT`
- `APP_DEBUG`

### Auth / security

Typical values include:

- `APP_PASSWORD`
- `SECRET_KEY`
- `COOKIE_MAX_AGE`
- `COOKIE_HTTPONLY`
- `COOKIE_SECURE`
- `COOKIE_SAMESITE`
- `API_KEY`

These settings are central to:
- login/session behavior
- cookie behavior
- protected routes
- import API protection

### Smart review tuning

Typical values include:
- smart review enablement toggle
- per-level counts
- cooldown days
- max per topic
- queue TTL hours

These values are often better first suspects than code bugs when queue behavior looks odd.

### Trash

Typical values include:
- `TRASH_RETENTION_DAYS`

### CORS

Typical values include:
- `CORS_ALLOWED_ORIGINS`

### AI topic suggestion

Typical values include:
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

These matter when diagnosing:
- missing AI config
- timeouts
- invalid provider responses
- provider mismatch issues

---

## Compose / local runtime summary

Local runtime generally includes:

- postgres service
- backend service using `.env`
- frontend build args such as:
  - `VITE_API_BASE_URL`
  - `VITE_PAGE_SIZES`
  - `VITE_DEFAULT_PAGE_SIZE`

If frontend and backend appear “out of sync,” check whether a config mismatch is the real cause before changing source code.

---

## Prod note

For production work, do not assume repo-local `.env` values are the source of truth.

Vault-managed secrets and workflows are the operational source of truth for production.

---

## Diagnostic discipline

Before proposing code changes, ask:

1. Could this behavior be config-driven?
2. Could this be a wrong environment value?
3. Could this be a cookie/CORS/session setting problem?
4. Could this be an AI provider/model setting issue?

If yes, inspect config before changing code.

---

## Common categories of config-driven failures

### Auth/session issues
Look at:
- password
- secret key
- cookie flags
- cookie lifetime

### Frontend/backend mismatch
Look at:
- frontend API base URL
- CORS
- cookie/security flags
- environment target

### AI topic suggestion issues
Look at:
- provider key presence
- model identifier
- base URL
- timeout-related upstream settings

### Migration/startup issues
Look at:
- DB connection settings
- migration connection behavior
- prepared-statement-related connection configuration if that problem appears again
