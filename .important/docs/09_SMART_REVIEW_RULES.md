# Smart Review Rules

## Purpose

Smart Review generates a focused study queue from the vocabulary base.

## Current selection model

Queue generation uses:
- configured counts per knowledge level
- cooldown window
- max-per-topic cap
- active/non-deleted words only

## Queue lifecycle

An active queue is reused if still valid.

A queue may be regenerated when:
- Smart Review is enabled and no active queue exists
- existing queue is expired
- queue is complete
- queue references invalid/inactive/deleted words
- queue has zero items but candidates now exist

## Word eligibility

A word is eligible when:
- it is active
- it is not soft-deleted
- its knowledge level matches configured buckets
- it is not blocked by cooldown
- it is not excluded by topic-cap balancing

## Completion

Completing a queue item marks the item complete and increments `completed_count`.

## Explicit V1 documentation rule

Do not describe Smart Review as generic spaced repetition.
It is currently a queue generator with configurable level buckets, cooldown, and balancing.
