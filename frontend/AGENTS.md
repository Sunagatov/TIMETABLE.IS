# frontend/AGENTS.md

## Purpose

Frontend is the authenticated review/search/edit UI for Memora V1.

For detailed frontend behavior, edge cases, tests, and runtime checks, read `.project/docs/ai/frontend-v1-mvp.md`. Keep this file short and module-scoped.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- TanStack React Query v5
- Tailwind CSS v4
- react-hook-form + zod for auth forms
- Vitest for focused frontend tests

## Structure

```
frontend/src/
  app/
    App.tsx
    main.tsx
    providers/AppQueryProvider.tsx
  features/
    auth/
      api/authApi.ts
      components/LoginForm.tsx
      hooks/useSessionBootstrap.ts
      pages/LoginPage.tsx
    review/
      api/reviewApi.ts
      components/
        ApprovedFiltersBar.tsx
        CategoryTree.tsx
        FailuresFiltersBar.tsx
        FilterControls.tsx
        NeedsReviewFiltersBar.tsx
        ReviewQueueList.tsx
        ItemDetailPanel.tsx          # compatibility export
        ReviewSidebar.tsx            # compatibility export
        item-detail/*                # focused item detail components
        sidebar/*                    # navigation, category manager, footer
        workspace/*                  # workspace layout helpers
      hooks/
        useReviewActions.ts
        useReviewQueries.ts
        useReviewWorkspaceState.ts
      pages/ReviewWorkspacePage.tsx
      types/reviewTypes.ts
  shared/
    api/httpClient.ts
    config/env.ts
```

## Rules

- Keep UI simple, explicit, and backend-backed.
- Default authenticated landing is Needs Review.
- Approved list must stay approved-only by default.
- Do not re-create backend state transitions locally.
- Every user-visible action must call a backend API and surface failed calls visibly.
- A 401 from any backend API call returns the user to login.
- Do not store auth tokens in browser storage.
- Keep category paths exactly 2 levels: `category`, `subcategory`.
- Use `createdFrom` and `createdTo` exactly for date filters.
- Do not add labels or manual web item creation in V1.
- Search is plain backend keyword search, not semantic search.
- Do not move deployment/runtime concerns here.

## Query Pattern

`reviewApi.buildQuery()` strips empty values and `"ALL"` before sending params.
All list query keys include params:

```typescript
["review", "needs-review", nrParams]
["review", "failures", failParams]
["review", "approved", approvedParams]
```

`useReviewWorkspaceState` owns per-view filters. Sidebar category selection and filter-bar category fields update the same active view state.

## Editing Pattern

- Reviewable edits use `POST /api/review/{itemId}/edit-and-approve`.
- Approved edits use `PATCH /api/items/{itemId}`.
- Failures can retry or delete to trash, but do not expose approve/edit actions.
- `GENERATED` and `EDITED` answers require non-blank answer text.
- Background category refetches must not wipe unsaved edits while edit mode is open.

## Error Pattern

- Use `shared/api/httpClient.ts` for backend calls.
- Use `readableErrorMessage(error, fallback)` for visible component errors.
- Do not silently ignore failed mutations.

## Validation

```bash
cd frontend
npm install
npm run build
npm run test:run
```
