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
- AI category path
- AI priority if available

### For text items
- raw input text
- cleaned text
- AI title
- AI type
- AI category path
- AI priority if available

## V1 Type enum

Exactly:
- `IDEA`
- `THOUGHT`
- `REMINDER`
- `OTHER`

If AI is uncertain, it must use `OTHER`.

## Category model

Exactly three levels:
- category
- subcategory
- subsubcategory

No arbitrary depth in V1.

## Priority enum

- `URGENT_IMPORTANT`
- `URGENT_NOT_IMPORTANT`
- `NOT_URGENT_IMPORTANT`
- `NOT_URGENT_NOT_IMPORTANT`
- `NOT_APPLICABLE`

If AI confidence is low, use `NOT_APPLICABLE`.

## Approval model

Approved items and unreviewed items are not the same pool.

## Lifecycle states

Suggested V1 lifecycle states:
- received
- transcription failed
- transcribed
- ai processing failed
- ai processed unreviewed
- human approved
- human edited approved
- rejected
- deleted

Exact naming may vary in implementation, but these conceptual states must remain present.

## Version visibility rule

For each item, Memora must preserve at least:
- original AI output
- latest human version

Both must remain visible to the user.
