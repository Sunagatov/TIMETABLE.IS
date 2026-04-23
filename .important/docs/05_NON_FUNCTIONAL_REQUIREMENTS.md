# Non-Functional Requirements

## NFR-01 Single-Owner Simplicity

The product is optimized for a single owner-user. Do not add multi-user abstractions unless explicitly requested.

## NFR-02 Backend as Source of Truth

Business rules must live in backend/domain/application code, not only in frontend behavior.

## NFR-03 Predictable API Errors

Validation, auth, conflict, and AI-failure cases must return clear, stable error responses.

## NFR-04 Security Baseline

The production deployment shall use:
- HTTPS
- secure session cookie settings
- CSRF verification for session-authenticated write routes
- API key protection for agent endpoint

## NFR-05 Password Handling

Passwords shall not be stored in plaintext within persistent storage.
Strong password hashing must be used where password material is persisted.

## NFR-06 Maintainability

Documentation and code should be understandable by:
- human developers
- Codex CLI
- Claude CLI

## NFR-07 No Over-Engineering

Prefer KISS and YAGNI.
Do not introduce speculative architecture.

## NFR-08 Clear Domain Boundaries

Keep topic logic, word logic, review logic, trash logic, stats logic, and AI workflows clearly separated.

## NFR-09 Soft Delete Safety

Soft-delete and restore flows must be reliable and explicit. Avoid silent destructive behavior.

## NFR-10 Import/Export Predictability

Workbook and AI-curation import/export flows must be deterministic and clearly documented.

## NFR-11 AI Assistive Posture

AI features are assistive. They must not silently mutate the source of truth without explicit import/update operations.

## NFR-12 Performance Expectations

The app does not need extreme scale optimization in current scope, but it should remain responsive for normal personal-use datasets.

## NFR-13 Documentation Quality

Requirements docs must be detailed enough that AI coding agents can implement features with minimal assumptions.

## NFR-14 Observability

The system should log meaningful lifecycle and failure events for startup, auth, and request failures.

## NFR-15 Configuration Clarity

Environment variables and feature toggles must be documented with intent, not just names.
