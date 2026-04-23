# Scope and Boundaries

## In Scope

### Core domain
- topic management
- word management
- hierarchical topic structure
- topic-based browsing
- progress/knowledge-level tracking
- soft delete and restore for topics and words

### Productivity workflows
- word search
- filtering by topic
- workbook import/export
- bulk API-based word creation
- AI topic suggestion for a word
- AI curation export/import workflows
- smart review queue generation and completion
- analytics/stats collection and reporting

### Security and access
- single-owner password login
- backend session cookie
- CSRF protection for session-authenticated routes
- API key protection for agent/bulk endpoint

## Explicitly Out of Scope

- multi-user roles and permissions
- public registration
- OAuth/social login
- user-generated communities
- cloud sync across multiple accounts
- audio pronunciation features
- spaced repetition engine beyond current smart-review rules
- generic CMS features
- marketplace/content publishing

## Boundary Clarifications

### AI boundary
AI is a helper for suggestion, enrichment, and curation-oriented workflows.
AI must not silently own source-of-truth decisions without explicit import/approval behavior.

### Frontend boundary
The repo currently contains only a frontend placeholder. Requirements in this pack define the intended frontend behavior so AI agents can build it without inventing product rules.

### Backend boundary
The backend is the current source of truth for domain behavior and must remain the primary reference for business rules until docs and code are fully aligned.
