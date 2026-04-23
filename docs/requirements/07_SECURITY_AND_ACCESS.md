# Security and Access

## V1 access model

- single-user access only
- password login screen in web app
- backend-managed authenticated session
- configurable session lifetime, default 30 days
- auto-redirect to login on expired/invalid session

## Minimum V1 security baseline

- HTTPS required
- backend-managed session cookies
- webhook secret verification for Telegram
- no signup/user management
- no public access model in V1

## Sensitive-content stance in V1

V1 may send eligible content to external AI APIs.

Fine-grained sensitivity controls are not part of V1.

This is an accepted V1 limitation/risk and must not be hidden by the docs.

## Password storage

Implementation must not store the app password in plaintext.
