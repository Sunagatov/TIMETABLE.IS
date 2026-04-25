# AI Docs

This folder exists to reduce assumptions and wasted tokens for:

- Claude CLI
- Codex CLI
- human maintainers

## Read order

1. `repo-map.md`
2. `current-bootstrap-state.md`
3. `api-surface.md`
4. `invariants.md`
5. `request-routing-guide.md`
6. `change-playbook.md`
7. `vault-boundary.md`

## Most useful files for current backend work

- `current-bootstrap-state.md` for what is already implemented vs still bootstrap
- `api-surface.md` for the current backend and bot-facing contracts
- `invariants.md` for stable product/state boundaries
- `env-runtime-reference.md` for source-repo config keys
- `request-routing-guide.md` for minimal-context file selection
- `token-budget-rules.md` for what to avoid loading by default

## Current high-signal traps

- Telegram bot is Kotlin long polling under `telegram-bot/`, not Python and not webhook-based.
- The bot is a thin adapter: commands are local-only, supported owner messages are forwarded, unsupported owner messages get guidance, unauthorized users are ignored.
- Use `spring.mongodb.uri` / `SPRING_MONGODB_URI`; Spring Boot 4 ignores the old `spring.data.mongodb.uri` path.
- Date filters are `createdFrom` and `createdTo`; do not use `dateFrom` / `dateTo`.
- Production runtime/deployment details belong in Vault, especially `apps/memora/` and `apps/whisper/`.
