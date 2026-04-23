# Code Grounds and Sources

This document explains what visible repo surfaces informed the replacement requirements pack.

## Read surfaces used

### Product and setup
- root README
- backend README
- frontend README
- docker-compose config
- shared config
- shared constraints

### Auth
- `backend/app/features/auth/router.py`

### Topics
- `backend/app/features/topics/router.py`
- `backend/app/features/topics/schemas.py`
- `backend/app/features/topics/refinement_schemas.py`

### Words
- `backend/app/features/words/router.py`
- `backend/app/features/words/schemas.py`
- `backend/app/features/words/suggest/router.py`
- `backend/app/features/words/agent_router.py`
- `backend/app/features/words/ai_curation/router.py`
- `backend/app/features/words/ai_curation/schemas.py`

### Smart review
- `backend/app/features/smart_review/router.py`
- `backend/app/features/smart_review/schemas.py`
- `backend/app/features/smart_review/service.py`

### Trash
- `backend/app/features/trash/router.py`

### Stats
- `backend/app/features/stats/router.py`
- `backend/app/features/stats/schemas.py`

## Honest limitation
The GitHub connector available in this environment did not reliably expose directory listing for the current docs folder, so this replacement pack is grounded in the actual code/config surfaces above rather than a perfect diff against every existing docs file.

That is still materially better than guessing product behavior from memory.
