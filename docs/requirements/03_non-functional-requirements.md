# Non-Functional Requirements

## NFR-01 Single-user optimization

The product is optimized for one user in V1.

## NFR-02 KISS

Prefer simple and understandable solutions.

## NFR-03 YAGNI

Do not implement future features before they are needed.

## NFR-04 Maintainability

The codebase must stay easy for:

- Claude CLI
- Codex CLI
- the human maintainer

## NFR-05 Backend/client separation

Backend business logic must remain client-agnostic.

## NFR-06 Session auth

The web app shall use password login with backend-managed session handling.

## NFR-07 Security baseline

Minimum baseline:

- HTTPS in real deployed environments
- session-based auth
- password not stored in plaintext
- internal backend bot-ingest secret
- no public write endpoints

## NFR-08 Performance priority

Fast, stable page loading matters more than instant processing completion.

## NFR-09 Reliability baseline

Accepted messages shall not disappear silently.

## NFR-10 Retryability

Failures shall be retryable.

## NFR-11 Small scoped files

Prefer reasonably small files where practical.

## NFR-12 No deployment files here

This repo must not absorb Vault runtime concerns.
