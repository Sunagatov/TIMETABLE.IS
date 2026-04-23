# Backend instructions — Memora

This file is the scoped operating contract for backend work.

## Backend stack

Confirmed from repository build files:

- Kotlin
- Spring Boot
- Java 21
- validation
- security

## Backend role

The backend is the Memora source of truth.

It owns application/business logic and must stay reusable by future clients beyond Telegram.

## Read order for backend tasks

### Always start with

- `backend/build.gradle.kts`
- `backend/src` entry points relevant to the task
- `docs/requirements/README.md`
- exact relevant requirement file(s)

### Then

Read only the exact target backend files.

If a task touches product behavior, read the exact relevant files in:
- `docs/requirements/`

If a task touches architecture or invariants, read:
- `docs/ai/architecture.md`
- `docs/ai/invariants.md`

If a task touches runtime/deployment behavior, check whether that truth actually lives in Vault before changing Memora source docs or code.

## Architectural pattern to preserve

Backend code should trend toward:

1. transport/web layer handles HTTP concerns
2. application/use-case layer owns business behavior
3. domain model stays free from Telegram-specific transport details
4. infrastructure layer handles persistence and integrations

Do not over-engineer this into a heavy enterprise framework. Keep it simple and explicit.

## Core backend invariants

### Client boundary invariants

- backend must remain client-agnostic
- Telegram must remain just one adapter
- future web/mobile/desktop clients must remain possible
- do not put Telegram-specific branching deep inside application logic

### Product invariants

- one Telegram message = one item
- processing is asynchronous
- new processed items enter review, not approved list
- approved items and review/failure areas stay separate
- category model is exactly 3 levels in V1
- V1 type enum is exactly:
  - `IDEA`
  - `THOUGHT`
  - `REMINDER`
  - `OTHER`

### V1 limitation invariants

- no Memora-managed audio storage in V1
- only Telegram references/IDs are persisted for voice traceability
- no QUESTION workflow in V1 MVP
- no labels in V1 MVP
- no regeneration workflows in V1 MVP
- no AI-created new categories in V1 MVP
- no view-count sorting in V1 MVP

## Persistence and state guidance

The backend should model item lifecycle explicitly.

Expected V1-style statuses include:

- received
- transcription failed
- transcribed
- ai processing failed
- ai processed / unreviewed
- human approved
- human edited + approved
- rejected
- deleted

Exact names may vary, but the state machine must remain explicit and readable.

## Failure-handling expectations

Backend work in this project must preserve:

- no silent loss after accepted bot acknowledgement
- retry counters / retry state recorded
- failure stage recorded
- failure reason recorded
- dedicated failure visibility in UI

## Telegram-specific backend guidance

The backend may accept Telegram metadata such as:

- message ID
- file ID
- file unique ID

But must not become Telegram-shaped throughout the domain model.

## Production/deployment boundary

Do not put deployment/runtime truth into Memora backend docs if it actually belongs in Vault.

For prod/deployment/runtime questions, read Vault first:

- `/Users/zufar/IdeaProjects/Vault`
- `apps/memora/README.md`
- `apps/memora/AI_AGENT_GUIDE.md`
- `apps/memora/PORTS_AND_RUNTIME.md`
- `apps/memora/ENV_CONTRACT.md`

## Change strategy

When changing backend code:

- keep the diff small
- keep state transitions explicit
- prefer boring code over smart code
- avoid speculative abstraction
- avoid coupling to Telegram transport concerns
- preserve requirement wording where behavior is sensitive

## Validation

Use the smallest useful backend validation first.

Typical choices:
- targeted Gradle test
- small build check
- exact feature-focused validation
