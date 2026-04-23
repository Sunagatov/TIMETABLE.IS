# Memora Requirements Index

This folder is the primary product/behavior source of truth for Memora.

If a coding agent or human is unsure how Memora is supposed to behave, this folder should be checked before inventing behavior.

## Read order

1. `00_PRODUCT_AND_PROBLEM.md`
2. `01_SCOPE_AND_V1_MVP.md`
3. `02_DOMAIN_MODEL_AND_STATES.md`
4. `03_USER_FLOWS.md`
5. `04_FUNCTIONAL_REQUIREMENTS.md`
6. `05_NON_FUNCTIONAL_REQUIREMENTS.md`

Then, if needed:
- `06_AI_BEHAVIOR_RULES.md`
- `07_SECURITY_AND_ACCESS.md`
- `08_FAILURE_HANDLING_AND_RETRY.md`
- `09_CLIENT_AND_API_BOUNDARIES.md`
- `10_VAULT_AND_PRODUCTION_BOUNDARIES.md`
- `11_FUTURE_PHASES.md`

## Why this folder exists

Without these files, coding agents tend to:
- over-assume
- couple backend to Telegram
- blur approved and unreviewed states
- invent V1 features that are actually future work
- waste tokens rediscovering product decisions

## Hard rule

When requirements and stale source comments disagree, this folder wins unless the user explicitly changes the requirement.

## Naming rule

The project is **Memora**.
