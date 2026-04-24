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
- default authenticated landing is Needs Review
- approved list should stay approved-only by default
- treat approved search/filter/sort as a backend-backed view when query endpoints exist, otherwise keep the shell client-side
- do not re-create backend state transitions locally
- do not move deployment concerns here
