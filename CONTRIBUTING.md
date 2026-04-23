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
- prefer local clarity over global cleverness

## Preferred commit message style

- `docs: clarify item status contract`
- `backend: add item status enum`
- `frontend: add needs review page shell`
- `telegram-bot: forward accepted text message to backend`

## Before considering a change done

Check:

- does it match docs?
- is it still in V1 scope?
- did it avoid unnecessary abstractions?
- is it easy for the next AI agent to continue?
- did it touch only the necessary files?
