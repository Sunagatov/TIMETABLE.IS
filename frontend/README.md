# Frontend

Memora frontend is the authenticated web review workspace for V1.

## Current State

- Password login with backend session bootstrap.
- Review-first workspace with Needs Review as the default authenticated landing.
- Three backend-backed list views: Needs Review, Failures, and Approved.
- Search, filters, date range (`createdFrom`/`createdTo`), category path filters, and sort use backend query params.
- Sidebar category tree and category management for exact 2-level paths: category / subcategory.
- Item detail shows current human-facing values beside original AI values, plus raw input/transcript and Telegram trace metadata.
- Review actions: approve, edit and approve, reject, delete to trash, retry failures, category proposal accept/dismiss, and AI regeneration actions.
- Approved items use the direct approved-only edit path and remain approved after save.
- Errors from failed API calls are shown in the UI; 401 responses return the user to login.
- Focused tests cover query param handling, category cascades, answer payload behavior, workspace params, and HTTP error parsing.

## Local Commands

```bash
npm install
npm run dev
npm run build
npm run test
npm run test:run
```

`npm run build` runs TypeScript and Vite production build.
`npm run test:run` runs the focused Vitest suite.

Detailed frontend agent guidance lives in `../.project/docs/ai/frontend-v1-mvp.md`.

## Docker

The frontend Dockerfile builds the Vite app with `VITE_API_BASE_URL` available as a build arg and serves `dist/` with nginx.

Runtime/deployment wiring lives in the Vault repository, not here.

## Boundaries

- Backend is the source of truth.
- The frontend does not implement state transitions locally.
- All list views remain backend-backed.
- Approved view remains approved-only by default.
- Telegram-only capture remains the V1 input path; no manual web item creation.
- Labels are out of scope for V1.
- Search is backend keyword search, not semantic search.
- Category paths are exactly 2 levels in V1: `category` / `subcategory`.
