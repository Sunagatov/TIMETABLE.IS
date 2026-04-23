# CODEX.md

## Purpose

Help Codex CLI continue work in Memora with low ambiguity, low token waste, and minimal repo scanning.

## Read order

1. `AGENTS.md`
2. `.claude/generated/request-routing.md` when task routing is unclear
3. nearest scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `telegram-bot/AGENTS.md`
4. exact docs relevant to the task
5. exact implementation files only

## Codex-specific guidance

- optimize for continuation by the next agent
- prefer direct data flow
- keep naming explicit
- avoid speculative abstractions
- keep files reasonably small where practical
- preserve V1 boundaries strictly
- do not silently widen scope because it feels useful

## Default change style

Prefer:
- one use case at a time
- one page/flow at a time
- one endpoint/service slice at a time
- one targeted validation at a time

Avoid:
- repo-wide scans by default
- broad rewrites
- architecture redesign without explicit requirement
- mixing product work with deployment concerns
