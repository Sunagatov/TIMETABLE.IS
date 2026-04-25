# CLAUDE.md

@AGENTS.md

## Claude Adapter

This file is Claude-specific workflow only. Detailed Memora facts live in `docs/ai/*`; do not duplicate them here.

Before broad scans:
- use `.claude/request-routing.md` or `docs/ai/request-routing-guide.md`
- read only the smallest scoped docs and files needed for the task
- treat `docs/ai/current-state.md`, `docs/ai/api-surface.md`, and `docs/ai/invariants.md` as canonical for current implementation details

Claude-specific habits:
- keep generated or cached context out of the source of truth unless a generator owns it
- avoid loading denied secret/env paths
- prefer exact file reads over whole-repo summaries
- report changed files and validation commands when finishing implementation work
