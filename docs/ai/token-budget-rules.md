# Token Budget Rules

## Default mindset

Repository context is expensive.

Prefer:
- one repo-level file
- one scoped file
- one or two compact docs
- exact feature files only

Avoid:
- whole-repo scans
- reading all three modules for one task
- repeating requirements that are already summarized
- carrying stale Lexora assumptions into Memora

## Stop conditions

Do not load more files once you know:
- exact entry point
- exact files to change
- exact requirement/invariant involved
- smallest validation needed

## Compression strategy

Before opening more code, prefer:
- `docs/requirements/README.md`
- `docs/ai/repo-map.md`
- `docs/ai/architecture.md`
- `docs/ai/invariants.md`

## Editing strategy

- modify as few files as possible
- avoid stylistic churn during requirement-driven work
- avoid speculative abstractions
- avoid deployment assumptions that belong in Vault
