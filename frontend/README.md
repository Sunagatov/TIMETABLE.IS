# Frontend

This folder contains the Memora web UI.

## Role

The web UI is the main surface for:

- login
- Needs Review
- Failures
- approved list
- item detail and editing
- search / filter / sort
- category tree browsing
- category management

## V1 product rule

The frontend must reflect the **review-first trust model**.

Fresh AI output does not automatically belong in the trusted approved list.

## Frontend responsibility boundaries

The frontend should:

- render backend state clearly
- expose review actions
- preserve state separation between approved/review/failure areas
- stay thin in business rules
- consume backend contracts rather than re-implementing logic in ad hoc ways

## Read next

- `frontend/AGENTS.md`
- `docs/requirements/`
- `docs/ai/architecture.md`
