# Vault and Production Boundaries

## Purpose

Prevent coding agents and humans from inventing or duplicating deployment/runtime truth inside the Memora source repo.

## Rule

Memora source repo owns application logic and requirements.

Vault owns production/deployment/runtime truth.

## Vault location

Local development path on the MacBook:
- `/Users/zufar/IdeaProjects/Vault`

Repository:
- `Sunagatov/Vault`

Primary Memora area:
- `apps/memora/`

## Start here in Vault for Memora operations

- `apps/memora/README.md`
- `apps/memora/AI_AGENT_GUIDE.md`
- `apps/memora/CHANGE_MAP.md`
- `apps/memora/PORTS_AND_RUNTIME.md`
- `apps/memora/ENV_CONTRACT.md`

## What belongs in Vault

- deploy/runtime files
- app.yaml / compose/runtime definitions
- production env contracts
- server-facing automation
- deployment coordination across backend/frontend/telegrambot
- port/runtime/container/source-of-truth operational mapping

## What belongs in Memora source repo

- source code
- product requirements
- architecture notes
- AI/human implementation guidance
- source-level constraints and invariants

## Hard rule for agents

If a task is about production or deployment behavior, check Vault before changing Memora docs or source assumptions.
