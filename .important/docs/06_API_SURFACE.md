# API Surface

## Public backend route groups

### `/health`
Health-check routes.

### `/auth`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`

### `/api/topics`
- list topics
- sidebar stats
- audit topics
- get topic by id
- create topic
- update topic
- split-plan
- delete topic

### `/api/words`
- list words
- export xlsx
- import xlsx
- export ai-review
- import ai-review
- get word by id
- create word
- update word
- delete word
- suggest topic
- bulk import (API key protected)

### `/api/smart-review`
- get active queue
- refresh queue
- complete item

### `/api/trash`
- list deleted words
- list deleted topics
- restore word
- restore topic
- purge

### `/api/stats`
- get stats
- post usage event

### `/api/ai-curation`
- list topics
- list topic words
- export topic
- import payload

## Protection model

### Not session-protected
- health
- auth login/logout/session
- bulk import uses API key instead of session

### Session + CSRF protected
- topics
- words CRUD
- suggest topic
- smart review
- trash
- stats
- ai curation

## Error contract expectations

Agents should preserve the existing shape:
- 400 for validation/domain input errors
- 401 for auth/session failures
- 404 for not found
- 409 for domain conflicts
- 422 for semantically invalid AI return cases
- 502/503/504 for external AI/service failures
