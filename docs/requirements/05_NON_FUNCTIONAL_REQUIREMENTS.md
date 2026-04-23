# Non-Functional Requirements

## NFR-01 Single-user optimization
The system is optimized for one user in V1.

## NFR-02 Simplicity first
Implementation must prefer simple, understandable solutions over heavy or speculative abstractions.

## NFR-03 Reliability baseline
Accepted items must not be silently lost after acknowledgement.

## NFR-04 Retryability
Processing failures must remain retryable and visible.

## NFR-05 Fast web UI matters more than fast processing
In V1, fast page loading and usable review/search flows matter more than instant processing completion.

## NFR-06 Maintainability
The project must remain easy to work on by:
- humans
- Claude CLI
- Codex CLI

## NFR-07 Readability over cleverness
Prefer explicit, boring code and docs over “smart” hidden behavior.

## NFR-08 No over-engineering
KISS and YAGNI are default principles.

## NFR-09 Backend client-agnostic design
Backend logic must remain reusable by future clients beyond Telegram.

## NFR-10 File-size discipline
Aim to keep files reasonably small and readable, preferably under roughly 350 LOC where practical.

## NFR-11 Production/deployment boundary discipline
Production and deployment/runtime truth must remain in Vault, not redefined inconsistently inside Memora source docs.
