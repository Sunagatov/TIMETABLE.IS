# Request Routing — Cheap Mode

Use this file before scanning the repo when you need a low-token routing decision.

## If the task is about backend behavior

Read:
- `backend/AGENTS.md`
- exact matching product docs
- exact backend files

Examples:
- item lifecycle
- review workflow
- failures/retries
- auth/session
- category logic
- AI orchestration
- ingestion endpoints

## If the task is about UI/screens

Read:
- `frontend/AGENTS.md`
- exact matching product docs
- exact frontend files

Examples:
- Needs Review page
- Failures page
- approved list
- item detail/edit
- login flow
- sidebar/filter/sort

## If the task is about Telegram ingestion/messages

Read:
- `telegram-bot/AGENTS.md`
- `docs/07_PROCESSING_PIPELINE.md`
- `docs/08_ERROR_HANDLING_AND_RETRY.md`
- exact bot files only

## If the task is about overall product behavior

Start with:
- `AGENTS.md`
- `docs/01_SCOPE_AND_MVP.md`
- `docs/03_FUNCTIONAL_REQUIREMENTS.md`

## If the task is unclear

Read only:
- `AGENTS.md`
- nearest scoped file
- one or two exact docs
Then narrow the task before reading code.

## Never do this by default

- do not scan the whole repo
- do not read the full docs tree for a small change
- do not read frontend + backend + bot together unless the task truly crosses all three
