# Contributing

## Working style

This repository should stay easy for:

- humans
- Claude CLI
- Codex CLI

## Principles

- docs first
- smallest useful change first
- minimal diffs
- no over-engineering
- preserve backend/client separation
- preserve V1 scope
- keep the next agent's continuation easy

## Preferred commit message style

- `docs: tighten agent read order`
- `backend: add item status transition`
- `frontend: add needs review shell`
- `telegram-bot: forward accepted text message to backend`

## Before considering a change done

Check:

- does it match docs?
- is it still in V1 scope?
- did it avoid unnecessary abstractions?
- is it easy for the next AI agent to continue?
- did it use the smallest relevant validation?

## PR / review mindset

A good change here is:

- clear
- scoped
- easy to trace
- easy to continue
- not wider than requested
