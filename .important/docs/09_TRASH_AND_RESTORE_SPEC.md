# Trash and Restore Specification

## Deletion model

Memora uses soft delete for words and topics.

## Deleted word behavior
A deleted word:
- disappears from active word lists
- remains restorable
- remains subject to restore constraints
- may later be purged

## Deleted topic behavior
A deleted topic:
- disappears from active topic lists
- remains restorable
- may fail restore if parent constraints are invalid
- may optionally restore words depending on route option

## Word restore constraints
A word cannot be restored if all of its topics are deleted. At least one active topic must exist.

A word restore may also fail if restoring it would create duplicate word/topic conflicts.

## Topic restore constraints
Topic restore may fail when parent-topic validity is broken or when restoring topic words would create duplicate conflicts.

## Purge
Trash purge performs hard delete.
- with `force=true`, all trashed items may be removed
- otherwise, only items older than retention policy are purged

## Product implication
Trash is not only UI convenience; it is a domain-protection layer preventing accidental permanent deletion.
