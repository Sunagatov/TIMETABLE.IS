# Engineering Principles

## Goal

Guide both human developers and AI coding agents toward simple, maintainable implementation choices.

## Core principles

### KISS

Keep solutions simple.

### YAGNI

Do not build abstractions for imagined future complexity unless there is a real current need.

### SOLID, but pragmatic

Use SOLID ideas to improve maintainability, not as an excuse for unnecessary layers or indirection.

## Required implementation style

- clear code over clever code
- no over-engineering
- readable structure
- minimal necessary abstractions
- small and understandable modules
- avoid giant files when practical
- target roughly under 350 LOC per file where reasonable

## Backend architecture principle

The backend must encapsulate business logic in a client-agnostic way.

Telegram bot code must act as an adapter/integration layer only.

## AI agent guidance

When AI coding agents implement Memora, they should:

- optimize for readability and maintainability
- keep business rules explicit
- avoid coupling domain logic to Telegram transport details
- avoid inventing features not present in the requirements
- prefer stable, boring code over “smart” code
