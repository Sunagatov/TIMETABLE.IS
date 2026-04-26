# Frontend V1 MVP Agent Guide

This is the canonical detailed frontend guide for AI agents. Use it when the task is frontend-only or when frontend behavior depends on backend contracts.

Keep root/tool adapters thin. Put durable frontend implementation facts here or in `frontend/AGENTS.md`.

## Frontend Purpose

The frontend is the authenticated review, search, and edit UI for Memora V1.

It is a client of the backend. The backend owns auth, list membership, item lifecycle, review actions, retry/regeneration behavior, category persistence, and all state transitions.

## Current Stack

- React 19
- TypeScript
- Vite 7
- TanStack React Query v5
- Tailwind CSS v4
- react-hook-form + zod for auth forms
- Vitest for focused frontend tests
- Static nginx image for Docker serving

Do not upgrade dependencies just because newer versions exist. Change versions only when the current build/test/runtime path is broken or the task explicitly asks for a stack change.

## Local Frontend Commands

Run from `frontend/`:

```bash
npm install
npm run build
npm run test:run
```

Use `npm ci` for clean install/build verification when lockfile reproducibility matters, such as Docker builds or final local validation.

Useful one-off checks:

```bash
npm ls react vite typescript tailwindcss vitest @vitejs/plugin-react @tailwindcss/vite
npm run dev
```

## Runtime And Deployment Boundary

Frontend source lives in `Memora/frontend`.

Runtime/deployment orchestration lives in Vault. Read Vault only for frontend runtime/deployment consistency tasks:

- `/Users/zufar/IdeaProjects/Vault/apps/memora/frontend/README.md`
- `/Users/zufar/IdeaProjects/Vault/apps/memora/frontend/Taskfile.yml`
- `/Users/zufar/IdeaProjects/Vault/apps/memora/frontend/docker-compose.yml`
- `/Users/zufar/IdeaProjects/Vault/apps/memora/frontend/app.yaml`

Known source/runtime contract:

- `frontend/Dockerfile` uses `npm ci`, builds Vite, and serves `dist/` with nginx.
- `VITE_API_BASE_URL` is a build-time Vite variable, not a runtime nginx secret.
- nginx must serve the SPA with fallback to `index.html`.
- Vault app manifest should point to the Memora frontend source path, not copy frontend source truth into Vault.
- Do not introduce production secrets or runtime config injection unless the deployment task proves it is necessary.

## Core UI Shape

Authenticated landing is Needs Review.

The workspace has three backend-backed list views:

- Needs Review
- Failures
- Approved

Approved remains approved-only by default. Capture is Telegram-only in V1. Do not add manual web item creation, labels, semantic search, or frontend-owned backend state transitions.

Desktop priority is review-first, not admin-first:

- mobile should keep the simpler one-column review feed mental model
- desktop should use that same cleaner control language, but still behave like a real workspace: queue on the left, persistent detail reader on the right
- Needs Review, Failures, and Approved belong with the main list controls in the sticky header area
- title, cleaned text, category, subcategory, type, and main review actions stay primary inside the selected item reader
- category browsing, category management, transcript/source inspection, original AI draft comparison, and other technical/debugging data should stay secondary or hidden behind explicit disclosure by default

The mobile model should stay simple and avoid route-heavy navigation. Do not introduce React Router unless a task has a strong reason.

## Frontend Structure

Primary folders:

- `src/app/` — app root, app-level providers, auth gate
- `src/features/auth/` — login, logout, session bootstrap
- `src/features/review/` — review workspace, lists, filters, categories, item detail, actions, types
- `src/shared/api/` — fetch wrapper, unauthorized handling, error message helpers
- `src/shared/config/` — frontend environment mapping

Review feature landmarks:

- `api/reviewApi.ts` — endpoint wrappers and `buildQuery`
- `types/reviewTypes.ts` — frontend API and enum union types
- `hooks/useReviewWorkspaceState.ts` — active view, per-view filters, selected item, mobile panel
- `hooks/useReviewQueries.ts` — React Query list/detail/category queries
- `hooks/useReviewActions.ts` — item action mutations and invalidation
- `pages/ReviewWorkspacePage.tsx` — page orchestration and layout wiring
- `components/CategoryTree.tsx` — collapsible 2-level category filter tree
- `components/sidebar/CategoryManager.tsx` — category create/rename/delete UI
- `components/ReviewQueueList.tsx` — queue header, view switching, filter toggle, and list cards
- `components/item-detail/*` — detail rendering, edit form, action toolbar, editor utilities
- `components/workspace/*` — responsive layout helpers

Keep components focused and readable. Split a file only when it improves clarity, not to satisfy an arbitrary line count.

## Auth Flow

Backend endpoints:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Frontend expectations:

- Session is backend-cookie based.
- `fetch` uses `credentials: "include"`.
- No auth token belongs in `localStorage` or `sessionStorage`.
- Reload bootstrap calls `GET /api/auth/session`.
- A session fetch failure means unauthenticated.
- A 401 from any API call emits the shared unauthorized event and returns the user to login.
- Logout should clear local authenticated UI even if the logout API call fails.
- Login failures and network failures must be visible and readable.
- Avoid auth effects that can rerender indefinitely on 401/session bootstrap failures.

Relevant files:

- `src/app/App.tsx`
- `src/features/auth/api/authApi.ts`
- `src/features/auth/hooks/useSessionBootstrap.ts`
- `src/features/auth/components/LoginForm.tsx`
- `src/features/auth/pages/LoginPage.tsx`
- `src/shared/api/httpClient.ts`

## HTTP Client And Error Handling

`src/shared/api/httpClient.ts` is the only generic fetch wrapper.

Expected behavior:

- Include cookies for backend session auth.
- Build the base URL from `VITE_API_BASE_URL`.
- Return `undefined` for HTTP 204.
- Parse JSON bodies when present.
- Extract backend `ApiErrorResponse.message` from failed JSON responses.
- Handle non-JSON error bodies without throwing parser errors.
- Convert raw fetch/network failures into user-friendly messages.
- Throw `UnauthorizedError` and notify auth listeners on 401.

Use `readableErrorMessage(error, fallback)` instead of duplicating unknown-error normalization in components.

Do not swallow mutation errors silently. If a mutation handles the error internally, it must still surface a visible message.

## List Query Contracts

All list endpoints accept the same backend query params:

- `keyword`
- `type`
- `status`
- `priority`
- `category`
- `subcategory`
- `createdFrom`
- `createdTo`
- `sort`

Critical date names: use `createdFrom` and `createdTo`. Never use `dateFrom` or `dateTo`.

`reviewApi.buildQuery()` must strip empty values and `"ALL"` before sending params. The frontend must never send `"ALL"` to backend.

List query keys include params:

```typescript
["review", "needs-review", nrParams]
["review", "failures", failParams]
["review", "approved", approvedParams]
```

`useReviewWorkspaceState` owns separate filters per view. Switching views must not leak filters between Needs Review, Failures, and Approved.

Sidebar category selection updates only the active view filters. Category cascade changes reset child levels when the parent changes.

## Enum Values

Item types:

- `IDEA`
- `THOUGHT`
- `QUESTION`
- `REMINDER`
- `OTHER`

Priority values:

- `URGENT_IMPORTANT`
- `URGENT_NOT_IMPORTANT`
- `NOT_URGENT_IMPORTANT`
- `NOT_URGENT_NOT_IMPORTANT`
- `NOT_APPLICABLE`

Failure statuses:

- `TRANSCRIPTION_FAILED`
- `AI_PROCESSING_FAILED`

Approved statuses:

- `HUMAN_APPROVED`
- `HUMAN_EDITED_APPROVED`

Answer statuses:

- `NONE`
- `GENERATED`
- `EDITED`
- `REJECTED`
- `DELETED`
- `FAILED`

Category proposal statuses:

- `NONE`
- `PROPOSED`
- `APPROVED`
- `REJECTED`

Sort options:

- `createdAt-desc`
- `createdAt-asc`
- `title-asc`
- `title-desc`
- `category-asc`
- `category-desc`

Prefer frontend union types for these values over random string literals.

## Review Workspace State Rules

Default view is Needs Review.

Selection rules:

- Select the first list item when the active list loads and no valid selected item exists.
- Clear selected item when the active list becomes empty.
- Disable the selected item detail query when no item is selected.
- After item actions, invalidate relevant list, detail, and category data instead of faking local state.
- Clear action errors when switching active view or selected item.
- Avoid stale selected item bugs after approve/reject/retry/delete/trash/regenerate actions.

Action UI rules:

- Busy state should disable only the relevant buttons.
- Destructive actions require confirmation.
- Errors must stay visible until user context changes or a new action clears them.
- Mobile list selection should open detail; detail needs a back path to list.

## Item Detail And Editing

The detail panel should default to the user-facing note, not ingestion/debug data.

Primary visible values:

- title
- cleaned text
- type
- priority
- category path
- answer for QUESTION items
- answer status

Secondary details:

- original raw text should be hidden behind an explicit disclosure and should not compete visually with the main cleaned note
- original AI draft should be hidden by default and shown only on demand when it meaningfully differs from the current values
- Telegram trace metadata should not appear in the normal review surface
- technical record metadata should not appear in the normal review surface
- category proposal and proposal status remain visible when actionable
- failure reason and answer failure reason remain visible when relevant

Action placement:

- place `Edit` as a contextual action in the item header, not as the main completion action
- place the main completion action in a sticky footer at the end of the reading flow: `Approve` for needs review, `Retry` for failures, `Save` while editing approved items; keep this footer visually minimal instead of wrapping it in a heavy control panel
- keep destructive and exceptional actions like reject, delete, and regeneration inside a secondary `More` menu instead of a full-width top button row

Queue header:

- show a clear Memora brand header
- present `Needs Review`, `Failures`, and `Approved` as a coherent view switcher, not as random standalone pills
- avoid high-attention logout chrome in the primary review surface for the current single-user flow

Needs Review items can:

- approve as-is
- edit and approve
- reject
- delete to trash
- approve category proposal
- reject category proposal
- regenerate cleaned text
- regenerate answer
- regenerate category proposal
- regenerate all AI working values

Failed items can:

- retry
- delete to trash

Approved items can:

- edit and save via `PATCH /api/items/{itemId}`

Do not show invalid approve/edit actions for failures. Do not PATCH reviewable items; use `edit-and-approve`.

Answer handling:

- `GENERATED` and `EDITED` require non-blank answer text.
- `NONE`, `REJECTED`, and `DELETED` should not send answer text.
- `FAILED` is displayable from backend but should not be manually settable; editing normalizes it only when appropriate.
- Regeneration actions are backend calls, not frontend text substitutions.

Edit form state:

- Reset form when the selected item changes.
- Do not wipe unsaved edits just because categories refetched while edit mode is open.
- Avoid sending `undefined` `categoryPath` unless the intended backend behavior is explicitly verified.
- Preserve raw transcript empty-string behavior deliberately.

Relevant files:

- `components/item-detail/ItemDetailPanel.tsx`
- `components/item-detail/ItemActionToolbar.tsx`
- `components/item-detail/ItemEditForm.tsx`
- `components/item-detail/AnswerEditor.tsx`
- `components/item-detail/itemDetailUtils.ts`

## Category UI Rules

Category paths are exactly 2 levels:

```text
category / subcategory
```

Frontend category behavior:

- Tree is collapsible.
- Category and subcategory clicks update the active category filter at that level.
- Subcategory clicks filter exact 2-level path.
- Clear filter works.
- Active filter is visually indicated.
- Create requires both levels non-blank before API call.
- Rename and delete are backend API calls.
- Delete requires confirmation.
- Backend errors such as non-empty category path, default-category deletion, or duplicate path must be visible.
- After rename, update the active filter if it referenced the renamed path.
- After delete, clear the active filter if it referenced the deleted path.
- Long category names should truncate/wrap safely.

Current implementation note:
- subcategories are leaf rows, not expandable empty third-level nodes

Do not implement arbitrary-depth categories in V1.

## Mobile And Accessibility Checks

Practical mobile requirements:

- User can switch sidebar/list/detail.
- List selection opens detail.
- Detail has a back button on mobile.
- Bottom nav does not cover critical controls.
- Filters, category manager, and edit form remain reachable.
- Long text is readable.
- Buttons wrap instead of overflowing horizontally.
- No critical action is hidden.

Practical accessibility requirements:

- Buttons have clear text or established icons with accessible labels.
- Form fields have labels.
- Disabled states are visible.
- Errors are visible and useful.
- Focus states are not removed.
- Clickable rows should be buttons, not divs.
- Long text and long category paths wrap or truncate safely.

Do not build a full design system unless the task explicitly requires it.

## Tests Worth Keeping Focused

Prefer small unit tests over brittle app snapshots.

High-value frontend tests:

- `buildQuery` strips empty values and `"ALL"`.
- `buildQuery` uses `createdFrom`/`createdTo`.
- `toListParams` strips empty values and `"ALL"`.
- category cascade resets child levels correctly.
- `normalizeAnswerStatus` behavior.
- `buildUpdateItemRequest` answer handling:
  - `GENERATED`/`EDITED` sends answer only when non-blank.
  - `NONE`/`REJECTED`/`DELETED` does not send answer.
  - `FAILED` normalizes safely.
- `formStateFromItem` maps `categoryId` correctly.
- `httpClient` parses backend JSON error messages and network failures.
- Login form shows validation and login failure messages when changed.
- Category tree selection/filter behavior when changed.

Avoid mocking the whole app when a utility or component-level test is enough.

## Frontend Runtime Consistency Checklist

Before changing frontend runtime/deployment config, verify:

- package.json and package-lock agree.
- local installed versions match intended package graph.
- `npm run build` passes.
- `npm run test:run` passes.
- Dockerfile uses `npm ci`.
- `VITE_API_BASE_URL` build arg is wired intentionally.
- nginx SPA fallback works.
- Vault app manifest points to Memora frontend source path.
- Vault local build/run tasks still target the frontend app and expected port.

Do not start production deployment, push images, or use real production secrets.

## Documentation Maintenance

When frontend behavior, contracts, routing, or structure changes, update the smallest owning docs:

- `.project/docs/ai/frontend-v1-mvp.md` for detailed frontend working knowledge.
- `frontend/AGENTS.md` for short module rules and map.
- `frontend/README.md` for human-facing source-level frontend overview.
- `.project/docs/ai/api-surface.md` when endpoint/query/payload contracts change.
- `.project/docs/ai/invariants.md` when durable behavior rules change.
- `.project/docs/ai/current-state.md` when current implementation reality changes.
- `.project/docs/ai/change-guide.md` when future agents need a new checklist.

Keep `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `AMAZONQ.md`, `.claude/*`, and `.amazonq/*` as pointers and workflow adapters.
