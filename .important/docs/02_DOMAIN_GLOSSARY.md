# Domain Glossary

## Item

A single captured unit in Memora. One Telegram message becomes one item.

## Source

The origin of an item.  
V1 sources:

- `TELEGRAM_VOICE`
- `TELEGRAM_TEXT`

## Raw transcript

The transcription output produced from a voice message before AI cleanup.

## Raw input text

The original Telegram text message content before AI cleanup.

## Cleaned text

The AI-polished version of the user's original content. It should sound like natural native-quality English while preserving the original intended meaning.

## Approved item

An item that has been explicitly accepted by the human reviewer and is allowed to live in the main knowledge base list.

## Needs Review

The queue/page containing AI-processed items that are waiting for human review.

## Failures

The queue/page containing items whose processing failed at a specific stage.

## Category

The top-level topic assigned to an item.

## Subcategory

The second-level topic assigned under a category.

## Subsubcategory

The third-level topic assigned under a subcategory.

## Type

A lightweight classification of what the item is.

V1 type enum:

- `IDEA`
- `THOUGHT`
- `REMINDER`
- `OTHER`

## Default category

A fallback category path used when no appropriate category can be chosen confidently in V1.

## Rejected item

An item intentionally kept in the system but not accepted into the approved knowledge base.

## Deleted item

An item moved to trash and recoverable later.

## Memora ID

A stable application-level identifier returned to the user in Telegram and used for traceability in the web app.
