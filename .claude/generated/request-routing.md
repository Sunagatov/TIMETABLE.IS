# Request routing — Memora

Use this file before scanning the repo.

## If the task is backend-only

Read:

1. `backend/AGENTS.md`
2. exact relevant docs
3. exact backend files touched by the change

Skip frontend and telegram-bot unless integration requires them.

## If the task is frontend-only

Read:

1. `frontend/AGENTS.md`
2. exact relevant docs
3. exact frontend files touched by the change

Skip backend and telegram-bot unless contract changes require them.

## If the task is telegram-bot-only

Read:

1. `telegram-bot/AGENTS.md`
2. exact relevant docs
3. exact bot files touched by the change

Skip backend/frontend internals unless the API contract is changing.

## If the task is cross-cutting

Read:

1. `AGENTS.md`
2. all relevant scoped `AGENTS.md` files
3. only the exact shared docs needed
4. only the exact files touched

## If the task is unclear

Start from the narrowest likely scope.
Do not do a whole-repo scan first.
