# Env and Runtime Reference

## Important boundary

This file is intentionally about **source-repo working boundaries**, not full production runtime truth.

For production/deployment/runtime truth, use Vault.

## Source-repo hints

### Backend
- Kotlin/Spring Boot app
- source of truth
- session-based auth expected by requirements

### Frontend
- React/Vite app
- review/search/edit UI

### Telegram bot
- Python-based thin adapter
- transport-focused

## Production/deployment truth lives in Vault

Use:
- `/Users/zufar/IdeaProjects/Vault`
- `apps/memora/README.md`
- `apps/memora/AI_AGENT_GUIDE.md`
- `apps/memora/PORTS_AND_RUNTIME.md`
- `apps/memora/ENV_CONTRACT.md`

## Hard rule

Do not turn Memora source docs into guessed deployment documentation.
