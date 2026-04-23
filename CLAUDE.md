# CLAUDE.md

## Purpose

Help Claude CLI work in Memora with low ambiguity and low token waste.

## How to start

1. Read `AGENTS.md`.
2. Read `.claude/generated/request-routing.md` if task scope is unclear.
3. Read the nearest scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`
4. Read only the exact product docs needed by the task.
5. Read only the exact implementation files you will touch.

Do **not** scan the whole repo unless the task is explicitly a broad audit.

## Claude-specific guidance

- prefer continuity over redesign
- preserve the repo’s existing direction unless the requirement changes
- keep diffs narrow and easy to review
- summarize assumptions before coding when a task is ambiguous
- prefer explicit transitions and straightforward code paths
- do not import ops/deployment habits from Vault into this app repo

## Current repo rules

- Memora is a product repo, not an ops repo.
- Deployment and infra belong elsewhere.
- Telegram is only one adapter.
- Backend owns business rules.
- Review-first trust model is central to the product.

## When changing behavior

Before making a behavioral change, check:
- `docs/03_FUNCTIONAL_REQUIREMENTS.md`
- `docs/04_NON_FUNCTIONAL_REQUIREMENTS.md`
- `docs/09_REVIEW_WORKFLOW.md`
- `docs/10_AI_BEHAVIOR_RULES.md`

## Validation rule

Run the smallest matching validation first instead of broad repo-wide checks.
