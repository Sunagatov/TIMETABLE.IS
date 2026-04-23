# API Surface and Security

## Public-ish bootstrap routes
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`
- health route(s)

## Session + CSRF protected route groups
- `/api/topics`
- `/api/words`
- `/api/words/suggest-topic`
- `/api/smart-review`
- `/api/trash`
- `/api/stats`
- `/api/ai-curation`

## API-key protected route
- `POST /api/words/bulk`

## Auth model

### Login
Input:
- password

Output:
- session cookie
- csrf_token in response body

### Session check
Returns:
- authenticated = true
- csrf_token

### Logout
Deletes session cookie.

## Session/Auth Requirements

- wrong password must return 401
- invalid session must return 401
- frontend must handle expired sessions gracefully
- CSRF token must be refreshed when session is refreshed

## Security Decisions to Preserve

- session-cookie auth for owner UI
- API key for automation/agent ingestion
- do not blur these two auth models together
