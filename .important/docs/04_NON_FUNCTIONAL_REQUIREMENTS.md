# Non-Functional Requirements

## NFR-01 Single-user optimization

The system is optimized for exactly one human user in V1.

## NFR-02 Simplicity first

The implementation shall prefer simple, understandable solutions over flexible-but-heavy architectures.

## NFR-03 Asynchronous processing

Capture acknowledgement speed and processing decoupling are more important than immediate completion.

The system shall support asynchronous handling of captured items.

## NFR-04 Reliability baseline

Drafts and processing records shall survive failures.

At minimum, the system shall not silently lose accepted items after Telegram acknowledgement.

## NFR-05 Retryability

Processing failures shall be retryable.

V1 shall support automatic retries first, then manual retries from UI.

Suggested initial defaults:

- transcription auto retry: 3 times
- AI processing auto retry: 2 times

These values should remain configurable.

## NFR-06 Performance priority

In V1, fast web page loading is more important than fast transcription completion.

## NFR-07 Security baseline

V1 minimum security baseline:

- HTTPS required
- password-based login
- backend-managed authenticated session
- Telegram webhook secret verification
- no sign-up flow
- no public access

## NFR-08 Session security

Session handling should use secure cookies and common protective attributes where applicable.

Recommended cookie properties:

- `HttpOnly`
- `Secure`
- `SameSite`

## NFR-09 Password storage

The application password shall not be stored in plaintext.

A strong password hashing method shall be used.

## NFR-10 Traceability

Every captured item shall have a stable Memora ID.

Operational messages and failure handling should refer to that ID.

## NFR-11 Data sensitivity risk note

V1 may send content to external AI APIs.

Sensitive-content fine-grained controls are out of scope in V1.

This must be documented as an accepted product risk.

## NFR-12 Maintainability

The system must be maintainable by both human developers and AI coding agents.

Code and structure must favor clarity over cleverness.

## NFR-13 Modularity

Although deployed as separate frontend/backend/bot containers, business logic shall remain backend-centered and reusable by future clients.

## NFR-14 File size and clarity

Implementation should prefer reasonably small source files for clarity. Targeting roughly under 350 LOC per file is desirable where practical, but not at the cost of awkward fragmentation.

## NFR-15 No over-engineering

The project shall follow KISS and YAGNI principles in V1.

Complex abstractions shall not be introduced before they are justified by real use cases.

## NFR-16 Storage limitation in V1

Memora shall not manage its own audio object storage in V1.

This is an intentional MVP limitation, not an accidental omission.
