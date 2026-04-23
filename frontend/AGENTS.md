# frontend/AGENTS.md

## Purpose

Frontend is the review/search/edit UI for Memora.

## Structural rule

Prefer:
- `app/*`
- `features/*`
- `shared/*`

Avoid collapsing everything into a single flat `pages + lib` structure if a feature-oriented split is clearer.

## Current feature areas
- `features/auth`
- `features/review`

## Rules
- keep UI simple and readable
- prefer explicit API functions
- preserve review-first workflow language
- do not move deployment concerns here
