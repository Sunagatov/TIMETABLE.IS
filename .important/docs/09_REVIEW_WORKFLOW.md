# Review Workflow

## Purpose

AI output is useful but not fully trusted by default.

Review workflow exists so only explicitly approved items enter the trusted approved list.

## Review queues

### Needs Review

Contains items that were processed successfully by AI but not yet reviewed by the human.

### Failures

Contains items that failed during one or more processing stages.

## Review actions in V1

For items in Needs Review, the user can:

- approve as is
- edit then approve
- reject
- delete
- retry processing
- manually change category path
- manually change type
- manually change priority

## Approval outcomes

### Approve as is

- current AI output becomes accepted
- status becomes `HUMAN_APPROVED`

### Edit then approve

- user edits fields first
- status becomes `HUMAN_EDITED_APPROVED`

### Reject

- item stays in the system
- item does not join approved list
- status becomes `REJECTED`

### Delete

- item moves to trash-like deleted state
- status becomes `DELETED`

## Approved list rule

Only approved items appear in the default main knowledge base list.

## Version visibility

The review UI should show both:

- original AI output
- latest human version

## Human edits after approval

If the user edits an already approved item later, the item remains approved automatically in V1.
