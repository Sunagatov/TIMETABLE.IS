# Requirements — Read This First

This folder is the product and engineering source of truth for Memora V1.

## Read order

1. `01_scope-and-mvp.md`
2. `02_functional-requirements.md`
3. `03_non-functional-requirements.md`
4. `04_domain-model.md`
5. `05_processing-pipeline.md`
6. `06_review-workflow.md`
7. `07_ai-behavior-rules.md`
8. `08_tech-stack-decision.md`
9. `09_future-phases.md`

## Core V1 summary

Memora is a **private, single-user capture-and-review system**.

It is built to:

- capture thoughts via Telegram voice or text
- process them asynchronously
- keep AI output separated from approved knowledge
- allow search/filter/edit in the web UI
- keep backend logic reusable by future non-Telegram clients
