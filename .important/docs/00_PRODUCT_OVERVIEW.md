# Memora — Product Overview

## Product summary

Memora is a personal English vocabulary learning application focused on:

- topic-based organization of vocabulary
- fast browsing and search
- manual and AI-assisted word curation
- smart review queue generation
- practical progress tracking

## Core user value

The user wants a clean personal workspace for building and maintaining an English vocabulary base. The product should support both day-to-day manual study and larger-scale maintenance/enrichment workflows.

## Product pillars

### 1. Topic-first organization

Words are primarily grouped by topics. Topics may be nested. Topics also drive navigation, progress views, smart review balancing, and curation workflows.

### 2. Word-centered study

Each word is a rich record, not just a term + translation pair. A word may include:

- term
- translations
- translation entries
- part of speech
- countability
- verb forms
- notes
- examples
- pattern
- knowledge level
- multiple topics

### 3. Smart review

The user does not want to manually assemble every review list. Memora generates a queue using configured per-level quotas, cooldown logic, topic balancing, and queue TTL.

### 4. Maintenance and curation

Memora is not only a learning UI. It is also a vocabulary database maintenance tool. It supports:

- XLSX import/export
- AI review export/import
- AI topic suggestion
- AI curation export/import
- topic audit and split-plan analysis
- trash and restore workflows

## Current architecture snapshot

- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: intended React + TypeScript + Vite direction
- Auth: single owner password + JWT session cookie + CSRF token
- AI: OpenAI-compatible endpoint configuration
- Deployment: Docker Compose with db/backend/frontend services

## Product owner reality

Memora is currently a personal project, not a multi-user SaaS. Requirements should optimize for correctness, clarity, and maintainability rather than premature generalization.
