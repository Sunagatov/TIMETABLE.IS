# Memora — Agent Instructions
# AI Agent Guidelines

These rules apply to Claude CLI, Codex CLI, ChatGPT, and human contributors.

## Core principles

- Prefer **clarity over cleverness**
- Follow **KISS** and **YAGNI**
- Apply **SOLID pragmatically**, not dogmatically
- Avoid over-engineering, especially in V1
- Keep business logic independent from delivery adapters like Telegram

## File size guidance

- Prefer files under ~350 lines where practical
- Split only when it improves clarity
- Avoid fragmentation into tiny files with no value

## Architecture guidance

- Backend is the source of truth
- Telegram bot is a thin adapter
- Frontend is a client of backend APIs only
- Core use cases must remain reusable by future clients (mobile, desktop, CLI)

## Documentation-first rule

Before implementing a major feature, read the relevant docs in `docs/` and update them if assumptions change.

## V1 restraint

Do not add speculative abstractions for:

- multi-user support
- public sharing
- advanced semantic search
- labels
- question-answering workflow
- audio object storage
- category suggestion approval flows

unless the docs are explicitly updated first.
