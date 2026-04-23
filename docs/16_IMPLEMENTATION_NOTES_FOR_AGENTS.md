# Implementation Notes for Agents

## What not to do

- Do not tie domain logic to Telegram SDK code
- Do not build multi-user abstractions in V1
- Do not add labels/question-answering/audio storage features in V1
- Do not create complex plugin systems early

## What to do

- Read docs first
- Keep architecture boring and testable
- Make backend use cases reusable for future clients
- Prefer clear names and explicit flows
