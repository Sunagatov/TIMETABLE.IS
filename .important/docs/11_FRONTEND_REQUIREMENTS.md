# Frontend Requirements

## Current repo reality

The frontend README is still a placeholder, so these requirements are especially important to avoid implementation drift.

## Core frontend responsibilities

- login flow
- session bootstrap
- CSRF-aware protected requests
- topic navigation
- word browsing
- word CRUD UI
- smart review UI
- trash UI
- stats dashboards/pages
- AI workflow UIs where applicable

## Required frontend behaviors

### Authentication
- check session on app boot
- redirect unauthenticated users to login
- keep CSRF token available for protected requests
- support logout

### Topic navigation
- render topic tree/list
- render sidebar stats
- allow topic create/update/delete flows
- support topic audit and split-plan views if exposed in UI

### Word management
- list and filter words
- support search
- create/update/delete words
- support import/export actions
- show example enrichment signals

### Smart review
- fetch queue
- render queue items in order
- allow completing item
- support refresh queue

### Trash
- list deleted words/topics
- restore deleted records
- allow purge action only with deliberate UX

### Stats
- render overview and timeline/summary sections without inventing new metrics

## Frontend anti-assumptions for agents

Agents must not:
- invent new auth flows
- switch to token-in-localStorage auth unless explicitly approved
- invent new learning states not present in backend
- assume frontend owns queue-generation rules
