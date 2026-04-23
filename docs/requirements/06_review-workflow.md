# Review Workflow

## Needs Review

Contains successfully processed items awaiting human review.

## Failures

Contains items that failed in one or more stages.

## Allowed review actions in V1

- approve as is
- edit then approve
- reject
- delete
- retry processing

## Approval outcomes

### Approve as is

Status becomes `HUMAN_APPROVED`.

### Edit then approve

Status becomes `HUMAN_EDITED_APPROVED`.

### Reject

Status becomes `REJECTED`.

### Delete

Status becomes `DELETED`.

## Approved knowledge base

Only approved items appear in the default main list.
