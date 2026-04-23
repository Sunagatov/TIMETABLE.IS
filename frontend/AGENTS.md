# Frontend instructions — Lexora

This file is the scoped operating contract for frontend work.

---

## Frontend stack

- React 19
- TypeScript 5
- Vite 6
- React Router 6
- React Query 5
- Vitest

---

## Read order for frontend tasks

### Start with

- `frontend/src/app/router.tsx`
- `frontend/src/shared/http.ts`

### Then

Read only the relevant feature files for the task.

Confirmed screens / flows include:

- login
- smart review
- topic study
- word page
- word edit page
- trash
- stats

---

## Shared frontend contracts

### HTTP contract

Most API calls should go through `frontend/src/shared/http.ts`.

Important behavior already centralized there:

- base URL normalization
- JSON content type defaults
- CSRF header injection
- `credentials: 'include'`
- normalized API error handling

Do not duplicate this logic across feature files.

### Routing contract

Keep route changes aligned with `frontend/src/app/router.tsx`.

Confirmed current routes include:

- `/login`
- `/smart-review`
- `/topics/:topicSlug`
- `/words/:wordId`
- `/words/:wordId/edit`
- `/trash`
- `/stats`

If root-route behavior changes, keep it aligned with the faster current product direction rather than reintroducing a slow landing screen without evidence.

---

## UI/UX guardrails

- keep study flow fast
- keep friction low
- avoid global state when local feature state is enough
- preserve mobile drawer / sidebar behavior
- keep filters, pagination, and quick-add behavior coherent
- do not degrade the dashboard/study experience by accident during unrelated edits

---

## Frontend correctness invariants

- when active words or topics change, invalidate caches that drive stats, smart review, and trash
- Smart Review should not render progress/counts from stale shared data while new data is loading
- mobile study drawer state should reset on route enter/exit
- pagination params should be normalized/clamped back into the URL instead of allowing UI/URL drift
- many-to-many topic membership must stay visible in editing flows
- topic tree hierarchy must remain visible when parent topics exist

---

## Topic and word editing notes

- word edit mode supports multiple topic memberships; do not collapse it back to single-topic semantics
- topic lists may render as a hierarchy/tree
- subtopics are still topics, not a separate entity type
- broad umbrella topics should stay visible when child topics exist
- prefer clarity over dense UI complexity

---

## Change strategy

When working on frontend:

- keep changes feature-local when possible
- avoid unrelated style cleanup
- avoid introducing new state layers unless justified
- preserve shared helper usage
- update route-aware UX carefully
- prefer small, reversible changes

---

## Validation

Use the smallest relevant validation first.

```bash
cd frontend
npm test
npm run lint
npm run build
```

For narrow work, targeted tests plus build are usually enough.
