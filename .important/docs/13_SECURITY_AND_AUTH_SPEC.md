# Security and Auth Specification

## Auth model

Memora is currently a single-owner application.

## Login
- user submits password
- backend compares against configured app password
- backend creates signed JWT session token
- backend sets session cookie
- backend returns CSRF token

## Session
- protected routes require valid session
- invalid or missing session results in 401

## CSRF
Protected routes use CSRF verification in addition to session verification.

## Logout
Logout deletes the session cookie.

## Cookie behavior
Current configurable session/cookie settings include:
- max age
- HttpOnly
- Secure
- SameSite

## API key
A separate API key guards the bulk import route.

## Important security boundary
Bulk import auth is not the same as browser session auth. Agents must not collapse these two mechanisms without explicit requirements change.

## CORS
Backend supports configured allowed origins.

## Operational rule
Production-like deployments should set secure cookie behavior appropriately via environment configuration.
