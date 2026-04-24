# frontend/AGENTS.md

## Purpose

Frontend is the review/search/edit UI for Memora.

## Tech stack

- React 19 + TypeScript
- Vite 7
- TanStack React Query v5 (server state, all list queries backend-backed)
- Tailwind CSS v4
- react-hook-form + zod (auth forms only)

## Structural rule

Prefer:
- `app/*`
- `features/*`
- `shared/*`

## Exact current file structure

```
frontend/src/
  app/
    App.tsx                          ← root router: login vs workspace
    main.tsx
    providers/AppQueryProvider.tsx   ← React Query client setup
  features/
    auth/
      api/authApi.ts
      components/LoginForm.tsx
      hooks/useSessionBootstrap.ts   ← checks session on mount, redirects
      pages/LoginPage.tsx
    review/
      api/reviewApi.ts               ← all backend calls, buildQuery() helper
      components/
        ApprovedFiltersBar.tsx       ← filter bar for Approved view
        CategoryTree.tsx             ← collapsible 3-level sidebar tree
        FailuresFiltersBar.tsx       ← filter bar for Failures view
        FilterControls.tsx           ← shared: FilterSelect, DateField, ResetButton, CategoryCascade
        ItemDetailPanel.tsx          ← AI output vs human-facing comparison + actions
        NeedsReviewFiltersBar.tsx    ← filter bar for Needs Review view
        ReviewQueueList.tsx          ← scrollable item list with status badges
        ReviewSidebar.tsx            ← nav (3 views) + CategoryTree + category management
      hooks/
        useReviewActions.ts          ← approve, editAndApprove, save, reject, delete, retry + refreshAll
      pages/
        ReviewWorkspacePage.tsx      ← main 3-column workspace, all state, all queries
      types/
        reviewTypes.ts               ← all shared types: MemoraItem, MemoraCategory, filter types, ListParams
  shared/
    api/httpClient.ts                ← fetch wrapper, UnauthorizedError, dispatches memora:unauthorized event
    config/env.ts                    ← VITE_API_BASE_URL
```

## Rules

- keep UI simple and readable
- prefer explicit API functions in `reviewApi.ts`
- preserve review-first workflow language
- default authenticated landing is Needs Review
- approved list must stay approved-only by default
- all three list views (Needs Review, Failures, Approved) are backend-backed — do not revert to client-side filtering
- do not re-create backend state transitions locally
- do not move deployment concerns here

## Filter param naming — critical

Frontend filter state uses `createdFrom` and `createdTo` (not `dateFrom`/`dateTo`).
Backend `ItemListQueryRequest` uses `createdFrom` and `createdTo`.
They must match exactly — mismatching silently drops date filters.

All filter params sent to backend:
- `keyword` — free text, searches title + cleanedText + rawTranscript + rawInputText
- `type` — IDEA | THOUGHT | REMINDER | OTHER
- `priority` — URGENT_IMPORTANT | URGENT_NOT_IMPORTANT | NOT_URGENT_IMPORTANT | NOT_URGENT_NOT_IMPORTANT | NOT_APPLICABLE
- `status` — ItemStatus enum value
- `category`, `subcategory`, `subsubcategory` — exact 3-level path filter
- `createdFrom`, `createdTo` — ISO date string YYYY-MM-DD
- `sort` — format: `field-direction` (e.g. `createdAt-desc`, `title-asc`, `category-desc`)
  - valid fields: `createdAt`, `title`, `category`
  - valid directions: `asc`, `desc`
  - default sort if omitted: `createdAt-desc`

## Key patterns

### buildQuery(params: ListParams)
Strips undefined values and values equal to `"ALL"`, builds URLSearchParams.
Lives in `reviewApi.ts`. Never sends "ALL" to backend.

### toListParams(filters)
Converts typed filter state objects (which use "ALL" as sentinel for "no filter selected") to `ListParams`.
Lives in `ReviewWorkspacePage.tsx`.

### Query key pattern
All list queries include params in the key so React Query refetches on filter change:
```typescript
queryKey: ["review", "needs-review", nrParams]
queryKey: ["review", "failures", failParams]
queryKey: ["review", "approved", approvedParams]
```

### useReviewActions hook
Handles approve, editAndApprove, save, reject, delete, retry.
All actions call `refreshAll()` which invalidates `["review"]`, `["item"]`, `["categories"]`.

### CategoryCascade component
Cascading category/subcategory/subsubcategory dropdowns. Lives in `FilterControls.tsx`.
Reused in all three filter bars.

### UnauthorizedError
`httpClient.ts` catches 401, dispatches `memora:unauthorized` DOM event, throws UnauthorizedError.
App listens for this event to redirect to login.

## NeedsReviewFilters / FailuresFilters / ApprovedFilters defaults

All defined in `ReviewWorkspacePage.tsx` as `DEFAULT_NR_FILTERS`, `DEFAULT_FAIL_FILTERS`, `DEFAULT_APPROVED_FILTERS`.
Type/priority/status/sort fields use `"ALL"` as "no filter" sentinel in state; `toListParams` strips it before backend call.

## Approved view status filter options

Only `HUMAN_APPROVED` and `HUMAN_EDITED_APPROVED` are offered as status filters in the Approved view.
Needs Review uses no status filter (only `AI_PROCESSED_UNREVIEWED` items are returned by backend).
Failures uses no status filter (only failure statuses are returned by backend).

## ItemDetailPanel action buttons by view

- Needs Review: Approve As Is, Edit Then Approve, Reject, Delete
- Failures: Retry, Delete
- Approved: Save Changes

## Current frontend validation

```
cd frontend && npm run build   # tsc + vite build, must be zero errors
```
