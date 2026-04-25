# CLAUDE.md

@AGENTS.md

## Claude Adapter

This file is Claude-specific workflow only. Detailed Memora facts live in `.project/docs/ai/*`; do not duplicate them here.

Before broad scans:
- use `.claude/request-routing.md` or `.project/docs/ai/request-routing-guide.md`
- read only the smallest scoped docs and files needed for the task
- treat `.project/docs/ai/current-state.md`, `.project/docs/ai/api-surface.md`, and `.project/docs/ai/invariants.md` as canonical for current implementation details
- for broad frontend auth/review/category/item-detail work, read `.project/docs/ai/frontend-v1-mvp.md`

Claude-specific habits:
- keep generated or cached context out of the source of truth unless a generator owns it
- avoid loading denied secret/env paths
- prefer exact file reads over whole-repo summaries
- report changed files and validation commands when finishing implementation work
