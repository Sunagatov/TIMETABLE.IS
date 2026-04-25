# CLAUDE.md

@AGENTS.md

## Claude Adapter

This file is Claude-specific workflow only. Detailed Memora facts live in `.project/docs/ai/*`; do not duplicate them here.

Before broad scans:
- use `.claude/request-routing.md` or `.project/docs/ai/request-routing-guide.md`
- read only the smallest scoped docs and files needed for the task
- treat `.project/docs/ai/current-state.md`, `.project/docs/ai/api-surface.md`, and `.project/docs/ai/invariants.md` as canonical for current implementation details
- for broad frontend auth/review/category/item-detail work, read `.project/docs/ai/frontend-v1-mvp.md`
- for source-level config/runtime questions, read `.project/docs/ai/env-runtime-reference.md`
- for change-impact questions, read `.project/docs/ai/change-guide.md`

Claude-specific habits:
- keep generated or cached context out of the source of truth unless a generator owns it
- avoid loading denied secret/env paths
- prefer exact file reads over whole-repo summaries
- keep adapters thin; put durable project facts in `.project/docs/ai/*`
- there is no root `scripts/ai/check-ai-docs.sh` wrapper; use `bash .project/scripts/ai/check-ai-docs.sh`
- report changed files and validation commands when finishing implementation work
- run `bash .project/scripts/ai/check-ai-docs.sh` after canonical doc or adapter changes
