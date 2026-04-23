# Functional Requirements

## FR-01 Authentication

The system shall support password-based login for a single owner account.

The system shall expose:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`

Successful login shall create a session cookie and return a CSRF token.

## FR-02 Route Protection

Session-authenticated routes shall require:
- valid session
- valid CSRF proof

The agent/bulk import route shall use API-key auth via header instead of session auth.

## FR-03 Topic Listing

The system shall list all topics.

The response shall include at least:
- id
- name
- slug
- description
- parent_topic_id
- is_active
- deleted_at
- created_at
- updated_at

## FR-04 Topic CRUD

The system shall support:
- create topic
- get topic by id
- update topic
- soft-delete topic

## FR-05 Topic Hierarchy

Topics shall support parent-child hierarchy through `parent_topic_id`.

The backend shall reject invalid parent assignments.

## FR-06 Topic Integrity

Deleting a topic shall be blocked when the topic has active child topics.

## FR-07 Topic Sidebar Stats

The system shall provide sidebar statistics including:
- total active words
- topic-specific word counts
- topic-specific progress values

## FR-08 Topic Audit

The system shall provide a topic audit endpoint that identifies broad or suspicious topics and explains why they may require review.

## FR-09 Topic Split Planning

The system shall provide a split-plan workflow for a topic.

The split plan shall include:
- whether split is recommended
- reasons
- proposed subtopics
- sample terms
- confidence
- unassigned word ids

## FR-10 Word Listing

The system shall list words with optional filters:
- topic_id
- search text

## FR-11 Word CRUD

The system shall support:
- create word
- get word by id
- update word
- soft-delete word

## FR-12 Word Multi-Topic Membership

A word may belong to multiple topics.

Word create and update flows shall support `topic_ids`.

## FR-13 Word Data Model

A word shall support at least these fields:
- term
- past_simple
- past_participle
- translations
- translation_entries
- part_of_speech
- knowledge_level
- countability
- pattern
- example
- example_entries
- notes
- is_active

## FR-14 Word Enrichment Status

The system shall compute and expose:
- example_count
- example_target_count
- example_status
- needs_example_enrichment

## FR-15 Duplicate Prevention

The backend shall prevent duplicate word creation in conflicting topic contexts and return explicit conflict errors.

## FR-16 Workbook Export

The system shall export words to `.xlsx`.

## FR-17 Workbook Import

The system shall import words from `.xlsx`.

The import result shall report at least:
- created count
- updated count
- skipped count
- per-sheet summary

## FR-18 AI Topic Suggestion

The system shall provide AI-assisted topic suggestion for a word+translation pair.

The suggestion must resolve to an existing topic name.

## FR-19 AI Topic Suggestion Failure Modes

The system shall surface explicit failure classes for:
- AI not configured
- no topics available
- AI returned unknown topic
- malformed AI response
- timeout
- transport/API failure

## FR-20 Agent/Bulk Import

The system shall provide an API-key-protected bulk word import endpoint.

The flow shall:
- create or reuse a topic by name
- insert words
- skip duplicates
- report added/skipped counts and terms

## FR-21 Smart Review Availability

The system shall expose a Smart Review queue endpoint.

If Smart Review is disabled, the endpoint shall return a clear unavailable error.

## FR-22 Smart Review Queue Retrieval

The system shall return an active queue or generate one when needed.

The queue response shall include:
- queue metadata
- item completion state
- embedded word data

## FR-23 Smart Review Refresh

The system shall support discarding the current active queue and generating a fresh queue.

## FR-24 Smart Review Completion

The system shall support marking individual queue items as completed.

## FR-25 Trash Listing

The system shall provide separate trash listings for:
- deleted words
- deleted topics

## FR-26 Restore Operations

The system shall support:
- restore deleted word
- restore deleted topic

The restore flow shall validate domain constraints before restoring.

## FR-27 Trash Purge

The system shall support hard purge of trashed data.

It shall support:
- retention-based purge
- force purge

## FR-28 Statistics Retrieval

The system shall provide a stats endpoint covering:
- vocabulary overview
- level distribution
- topic stats
- daily activity
- usage summary
- retention summary
- efficiency summary
- consistency summary
- queue summary
- words added by month

## FR-29 Usage Tracking

The system shall accept usage-event posts from the frontend.

## FR-30 AI Curation Topic Listing

The system shall list topics for AI curation with pagination.

## FR-31 AI Curation Topic Export

The system shall export topic words for AI curation in:
- full mode
- lean mode

Lean mode is intended for external AI enrichment workflows.

## FR-32 AI Curation Import

The system shall accept structured AI curation import payloads for:
- topic creation
- word update
- word creation
- word reassign

The import shall support:
- dry run
- strict mode
- import result summary

## FR-33 Frontend Requirements Baseline

The future frontend shall support all product surfaces implied by the backend:
- auth/login shell
- topic tree browsing
- topic CRUD screens
- word CRUD screens
- search/filter
- smart review
- trash/restore
- stats dashboards
- workbook import/export
- AI topic suggestion
- AI curation workflows
