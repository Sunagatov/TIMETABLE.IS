# AI Agent Workflow

## Purpose

Make repeated work in this repository easier for Claude CLI and Codex CLI.

## For any non-trivial task

1. read `AGENTS.md`
2. identify affected docs
3. restate the exact scope
4. implement the smallest correct change
5. update docs only if behavior changed

## Preferred task slicing

Prefer slices like:

- one endpoint + one use case + one test file
- one page + one data-fetch path
- one status transition path
- one category operation

Avoid giant mixed changes.

## Before opening a PR or commit

Check:

- does it stay in V1 scope?
- does it keep backend client-agnostic?
- did it avoid unnecessary abstractions?
- is the code still easy for the next AI agent to continue?

## If stuck

Do not invent product behavior.  
Return to `docs/`.
