# CODEX.md

## Purpose

Compact guidance for Codex CLI.

## Core instructions

- Read the docs before coding.
- Keep the repo aligned with feature/domain structure.
- Backend must stay reusable beyond Telegram.
- Do not copy deployment/runtime logic into this repository.
- Stay within V1 scope unless the user explicitly expands it.
- Prefer current uppercase requirement files when both uppercase and legacy lowercase variants exist.

## Preferred workflow

1. read `AGENTS.md`
2. read `docs/ai/current-bootstrap-state.md`
3. read `docs/ai/request-routing-guide.md`
4. identify the smallest affected domain area
5. implement one clear slice
6. update docs if behavior changed

## Preferred style

- simple > clever
- explicit > magical
- feature-oriented > global technical layers
- maintainable > hyper-abstract

## Current backend reality

- current backend packages: `auth`, `capture`, `category`, `common`, `config`, `health`, `item`, `review`
- `MemoraItem` preserves original AI output and latest human-facing state separately
- category paths are exact 3-level leaf paths, not arbitrary-depth trees
- approved items stay approved after human edits in V1
- voice ingest is accepted and persisted, but full transcription remains future work
