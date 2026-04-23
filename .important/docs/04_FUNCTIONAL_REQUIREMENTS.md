# Functional Requirements

## FR-01 Authentication
The system shall support single-owner login using a password-based endpoint.

## FR-02 Session lifecycle
The system shall expose:
- login
- logout
- session status retrieval

Protected routes shall require valid session and CSRF verification unless explicitly excluded.

## FR-03 Topic listing
The system shall return all active/non-deleted topics through the topics list API.

## FR-04 Topic retrieval
The system shall return a single topic by id or 404 if not found.

## FR-05 Topic creation
The system shall support topic creation with:
- name
- optional description
- optional parent topic
- active flag

## FR-06 Topic update
The system shall support topic updates including:
- name
- slug
- description
- parent topic
- active flag

The update contract shall reject explicit nulls for fields that must be omitted rather than nulled.

## FR-07 Topic deletion
The system shall soft-delete topics. Topic deletion shall fail if active child-topic constraints are violated.

## FR-08 Topic sidebar stats
The system shall expose per-topic counts/progress data for sidebar rendering.

## FR-09 Topic audit
The system shall expose a topic audit report with broadness signals and review recommendations.

## FR-10 Topic split plan
The system shall expose a split-plan workflow that proposes subtopics and candidate word assignments.

## FR-11 Word listing
The system shall list words with optional filtering by topic and optional keyword search.

## FR-12 Word retrieval
The system shall return a single word by id or 404 if not found.

## FR-13 Word creation
The system shall support word creation with required topic assignment and lexical metadata.

## FR-14 Word update
The system shall support partial word updates including topic reassignment and progress updates.

## FR-15 Word deletion
The system shall soft-delete words.

## FR-16 XLSX export
The system shall export words to XLSX format.

## FR-17 XLSX import
The system shall import words from XLSX format and report created/updated/skipped counts.

## FR-18 AI review export/import
The system shall support topic-scoped export for AI review and structured import of AI-reviewed payloads.

## FR-19 AI topic suggestion
The system shall support AI topic suggestion for a given term/translation pair.

## FR-20 API-key bulk import
The system shall support agent-oriented bulk word creation guarded by an API key.

## FR-21 Smart review queue retrieval
The system shall return the current active smart review queue or generate one when needed.

## FR-22 Smart review queue refresh
The system shall regenerate a fresh queue on explicit refresh.

## FR-23 Smart review completion
The system shall mark queue items complete and update queue counters.

## FR-24 Trash listing
The system shall list deleted words and deleted topics separately.

## FR-25 Restore
The system shall restore deleted words/topics when domain constraints allow.

## FR-26 Trash purge
The system shall hard-delete trashed records on purge according to force or retention rules.

## FR-27 Stats retrieval
The system shall return a comprehensive stats payload for learning, usage, and queue metrics.

## FR-28 Usage recording
The system shall record usage events through a dedicated endpoint.

## FR-29 AI curation export/import
The system shall support AI-curation export/import for topic-wide maintenance workflows including:
- topic creation
- word creation
- word update
- topic reassignment

## FR-30 Error semantics
The system shall use explicit HTTP status codes and clear error messages for common domain and integration failures.
