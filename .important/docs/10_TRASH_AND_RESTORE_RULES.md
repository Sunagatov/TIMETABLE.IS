# Trash and Restore Rules

## Trash Philosophy

Deletion is soft first, hard later.

## Topic delete
- soft delete only
- forbidden when active child topics exist

## Word delete
- soft delete only

## Restore rules for words
A deleted word may be restored only when:
- the word exists in trash
- at least one of its topics is still active
- restore does not violate duplicate constraints

## Restore rules for topics
A deleted topic may be restored only when:
- the topic exists in trash
- parent constraints remain valid
- restoring words under that topic does not create invalid duplicates when requested

## Purge rules
Trash purge supports:
- retention-based purge
- full force purge

## Documentation rule
AI agents must not conflate:
- soft delete
- reject/archive semantics
- hard purge
