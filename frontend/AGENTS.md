# frontend/AGENTS.md

## Purpose

Frontend is the authenticated review/search/edit UI for Memora V1.

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
- Keep category paths exactly 3 levels: `category`, `subcategory`, `subsubcategory`.
- Use `createdFrom` and `createdTo` exactly for date filters.
- Do not add labels or manual web item creation in V1.
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

## Validation

```bash
cd frontend
npm install
npm run build
npm run test:run
```
