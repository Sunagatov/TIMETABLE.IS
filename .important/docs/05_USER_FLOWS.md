# User Flows

## Flow 1 — Login
1. User opens frontend.
2. Frontend checks session.
3. If unauthenticated, login screen is shown.
4. User submits password.
5. Backend validates password.
6. Backend sets session cookie.
7. Backend returns CSRF token.
8. Frontend stores CSRF token for protected requests.

## Flow 2 — Browse topics and words
1. User loads app.
2. Frontend fetches sidebar stats and topics.
3. User chooses a topic.
4. Frontend fetches words for topic or with search filter.
5. User browses word details.

## Flow 3 — Create/update word
1. User opens word form.
2. User provides word fields and topic selection.
3. Frontend sends request with session + CSRF.
4. Backend validates topics and domain rules.
5. Backend persists word.
6. Frontend shows updated result.

## Flow 4 — Soft-delete and restore
1. User deletes word or topic.
2. Backend soft-deletes record.
3. Record disappears from active list.
4. User opens trash page.
5. User restores item.
6. Backend validates restore constraints.
7. Restored item reappears in active lists.

## Flow 5 — Smart review
1. User opens smart review page.
2. Frontend requests active queue.
3. Backend returns active queue or generates new one.
4. User marks items complete one by one.
5. Backend updates queue item and completed count.
6. If queue is complete/invalid/expired, a new queue is generated on next retrieval.

## Flow 6 — AI topic suggestion
1. User or agent submits term + translation.
2. Backend calls configured AI endpoint.
3. Backend validates response against existing topic set.
4. Backend returns suggested topic or integration/domain error.

## Flow 7 — AI review export/import
1. User exports topic words for AI review.
2. External AI enriches or updates payload.
3. User imports reviewed payload.
4. Backend validates payload and applies changes.
5. Response summarizes imported results.

## Flow 8 — AI curation workflow
1. User exports topic curation page.
2. External AI prepares structured operations.
3. User imports curation payload.
4. Backend validates operations.
5. Backend creates topics / updates words / reassigns topics as requested.
6. Response summarizes created/updated/reassigned results.

## Flow 9 — Topic refinement
1. User opens topic audit.
2. User identifies broad or suspicious topics.
3. User requests split plan for a topic.
4. Backend returns proposed subtopics and word grouping suggestions.
5. Human decides what to apply manually.
