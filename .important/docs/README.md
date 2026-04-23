# Memora Requirements Pack

This archive is a replacement-ready documentation pack for the **Memora** project.

It is written to reduce ambiguity for:
- Codex CLI
- Claude CLI
- human maintainers

The pack is grounded in the current repository surface that is visible through the repo:
- single-password auth with JWT session cookie and CSRF token
- FastAPI backend
- topic CRUD + topic audit + topic split plan
- word CRUD + XLSX import/export + AI review import/export
- smart review queue generation and completion
- trash/restore/purge flows
- stats and usage tracking
- AI topic suggestion
- AI curation import/export

## Recommended reading order

1. `00_PRODUCT_OVERVIEW.md`
2. `01_SCOPE_AND_BOUNDARIES.md`
3. `02_DOMAIN_GLOSSARY.md`
4. `03_DOMAIN_MODEL.md`
5. `04_FUNCTIONAL_REQUIREMENTS.md`
6. `05_USER_FLOWS.md`
7. `06_API_SURFACE.md`
8. `07_SMART_REVIEW_SPEC.md`
9. `08_AI_WORKFLOWS.md`
10. `09_TRASH_AND_RESTORE_SPEC.md`
11. `10_STATS_AND_TRACKING_SPEC.md`
12. `11_FRONTEND_REQUIREMENTS.md`
13. `12_BACKEND_REQUIREMENTS.md`
14. `13_SECURITY_AND_AUTH_SPEC.md`
15. `14_CONFIGURATION_AND_ENVIRONMENT.md`
16. `15_ENGINEERING_RULES_FOR_AI_AGENTS.md`
17. `16_OPEN_QUESTIONS_AND_FUTURE_PHASES.md`
18. `17_CODE_GROUNDS_AND_SOURCES.md`

## Goal

These docs should let an implementation agent work with **minimal assumptions** and reduce token waste caused by repeated clarifications.
