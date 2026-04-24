# Requirements — Read This First

This folder is the product and engineering source of truth for Memora V1.

## Read order

1. `01_SCOPE_AND_V1_MVP.md`
2. `02_DOMAIN_MODEL_AND_STATES.md`
3. `03_USER_FLOWS.md`
4. `04_FUNCTIONAL_REQUIREMENTS.md`
5. `05_NON_FUNCTIONAL_REQUIREMENTS.md`
6. `06_AI_BEHAVIOR_RULES.md`
7. `07_SECURITY_AND_ACCESS.md`
8. `08_FAILURE_HANDLING_AND_RETRY.md`
9. `09_CLIENT_AND_API_BOUNDARIES.md`
10. `10_VAULT_AND_PRODUCTION_BOUNDARIES.md`

Legacy lowercase mirrors still exist in this folder for historical reasons. Prefer the uppercase files above unless a task explicitly says otherwise.

## Core V1 summary

Memora is a **private, single-user capture-and-review system**.

It is built to:

- capture thoughts via Telegram voice or text
- process them asynchronously
- keep AI output separated from approved knowledge
- allow search/filter/edit in the web UI
- keep backend logic reusable by future non-Telegram clients

## Source-of-truth split reminder

- application source + requirements = `Sunagatov/Memora`
- deployment/runtime/prod files = `Sunagatov/Vault`, especially `apps/memora/`
