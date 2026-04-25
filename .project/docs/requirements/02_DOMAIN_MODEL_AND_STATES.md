# Domain Model and States

## Main entity: Item

One Telegram message becomes one Memora item.

## Input source types

Expected source shapes:
- Telegram voice
- Telegram text

## Stored content forms

### For voice items
- Telegram metadata / references
- raw transcript
- cleaned text
- AI title
- AI type
- AI category path (original AI suggestion)
- AI priority if available
- answer (if item type is `QUESTION`)

### For text items
- raw input text
- cleaned text
- AI title
- AI type
- AI category path (original AI suggestion)
- AI priority if available
- answer (if item type is `QUESTION`)

### Version visibility rule

For each item, Memora must preserve at least:
- original AI output (title, cleaned text, type, category path, priority, answer)
- latest human version

Both must remain visible to the user, preferably side-by-side or clearly comparable.

## V1 Type enum

Exactly:
- `IDEA`
- `THOUGHT`
- `QUESTION`
- `REMINDER`
- `OTHER`

If AI is uncertain, it must use `OTHER`.

`QUESTION` is a V1 feature. When AI infers type `QUESTION`, it must also generate an answer.

## Category model

Exactly two levels:
- category
- subcategory

No arbitrary depth in V1.

### AI category behavior

AI should:
1. Try to match an existing category/subcategory path.
2. If no existing path fits well, AI may suggest a new 2-level category path.
3. Suggested new category paths must be reviewed and approved by the human during item review.
4. Once approved, the path becomes reusable for future items.
5. If category selection/suggestion fails or confidence is low, use the default category path.

Example expected category directions:
- Career ideas
- Pet project ideas / improvements
- Side hustle / business / monetization ideas
- Interview preparation ideas
- Health improvement ideas
- Random thoughts
- Personal reflections
- Hobby ideas
- Relationship ideas
- Entertainment ideas
- English learning ideas
- Investment / Finance / Money ideas
- Questions about nature / animals / the world / tech / finance / health

This list is illustrative, not a mandatory seed constraint.

## Priority enum

- `URGENT_IMPORTANT`
- `URGENT_NOT_IMPORTANT`
- `NOT_URGENT_IMPORTANT`
- `NOT_URGENT_NOT_IMPORTANT`
- `NOT_APPLICABLE`

If AI confidence is low, use `NOT_APPLICABLE`.
Human can edit priority later.

## Approval model

Approved items and unreviewed items are not the same pool.

New AI-processed items always enter Needs Review first, never the approved list directly.

## Lifecycle states

V1 lifecycle states (conceptual — exact naming may vary in implementation, but these states must remain present):
- `RECEIVED`
- `TRANSCRIPTION_FAILED`
- `TRANSCRIBED`
- `AI_PROCESSING_FAILED`
- `AI_PROCESSED_UNREVIEWED`
- `HUMAN_APPROVED`
- `HUMAN_EDITED_APPROVED`
- `REJECTED`
- `DELETED`

### State area mapping
- **Needs Review**: `AI_PROCESSED_UNREVIEWED`
- **Failures**: `TRANSCRIPTION_FAILED`, `AI_PROCESSING_FAILED`
- **Approved list** (default): `HUMAN_APPROVED`, `HUMAN_EDITED_APPROVED`
- **Rejected**: `REJECTED`
- **Trash/deleted**: `DELETED`
