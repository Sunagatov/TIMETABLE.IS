# User Flows

## Flow 1 — login
1. User opens app.
2. If no valid session exists, user sees login screen.
3. User submits password.
4. Backend validates password.
5. Backend sets session cookie and returns CSRF token.
6. Frontend enters authenticated state.

## Flow 2 — create topic
1. User opens topic management.
2. User creates a topic with name, optional description, optional parent.
3. Backend validates hierarchy and uniqueness constraints.
4. Topic appears in list/tree.

## Flow 3 — update topic
1. User edits topic name/slug/description/parent/is_active.
2. Backend validates update.
3. Topic tree refreshes.

## Flow 4 — delete topic
1. User attempts to delete topic.
2. Backend rejects if topic still has active child topics.
3. If valid, topic is soft-deleted.
4. Topic becomes visible in trash.

## Flow 5 — create word
1. User chooses one or more topics.
2. User enters required vocabulary fields.
3. Backend validates payload and duplicate constraints.
4. Word is stored and becomes visible in topic/word views.

## Flow 6 — update word
1. User edits vocabulary fields or topic membership.
2. Backend validates topic references and duplicate constraints.
3. Updated word is returned.

## Flow 7 — workbook import
1. User uploads `.xlsx`.
2. Backend validates workbook shape and file type.
3. Backend imports words.
4. Result summary is shown.

## Flow 8 — workbook export
1. User triggers export.
2. Backend streams `.xlsx` workbook to client.

## Flow 9 — AI topic suggestion
1. User provides term + translation.
2. Backend calls AI suggestion service.
3. Backend either returns existing topic name or a clear error.

## Flow 10 — smart review session
1. User opens Smart Review.
2. Backend returns active queue or generates one.
3. User reviews words and completes items.
4. Progress updates in queue response.
5. If queue completes or expires, backend can regenerate.

## Flow 11 — trash restore
1. User opens trash.
2. User selects word/topic to restore.
3. Backend checks restore constraints.
4. If valid, item is restored to active state.

## Flow 12 — AI curation export/import
1. User exports topic words for AI curation.
2. External AI tool enriches/corrects data.
3. User imports structured payload.
4. Backend validates operations.
5. Backend reports created/updated/reassigned summary.
