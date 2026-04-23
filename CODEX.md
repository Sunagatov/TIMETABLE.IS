# CODEX.md

## Purpose

Help Codex CLI continue work in Memora with low ambiguity and low token waste.

## Read order

1. `AGENTS.md`
2. `.claude/generated/request-routing.md`
3. nearest scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`
4. exact docs relevant to the task
5. exact implementation files only

## Codex-specific guidance

- optimize for continuity
- keep naming explicit
- prefer direct data flow
- avoid speculative abstractions
- keep files reasonably small where practical
- preserve V1 boundaries strictly
- choose the smallest stable step that keeps future work easy

## Do not do by default

- do not scan unrelated app folders
- do not redesign architecture without a requirement
- do not add deployment concerns
- do not introduce new product behavior silently
- do not widen scope just because it feels useful

## Preferred change style

- one small slice at a time
- one use case at a time
- one route/page/flow at a time
- one targeted validation at a time

## If stuck

Return to the nearest scoped `AGENTS.md`, then the exact relevant docs.
Do not guess product behavior.
