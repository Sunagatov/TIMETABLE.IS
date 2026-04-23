# CODEX.md

## Purpose

Compact guidance for Codex CLI.

## Core instructions

- Read the docs before coding.
- Keep the repo aligned with feature/domain structure.
- Backend must stay reusable beyond Telegram.
- Do not copy deployment/runtime logic into this repository.
- Stay within V1 scope unless the user explicitly expands it.

## Preferred workflow

1. read `AGENTS.md`
2. read `docs/ai/current-bootstrap-state.md`
3. identify the smallest affected domain area
4. implement one clear slice
5. update docs if behavior changed

## Preferred style

- simple > clever
- explicit > magical
- feature-oriented > global technical layers
- maintainable > hyper-abstract
