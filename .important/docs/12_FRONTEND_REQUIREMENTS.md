# Frontend Requirements

## Context

The repo currently contains a frontend placeholder only.
This file defines the intended frontend so AI agents do not invent UX scope randomly.

## Required screens/views

### Auth
- login screen
- expired-session redirect behavior

### Main shell
- app layout
- navigation to topics, words, review, trash, stats, AI tools

### Topics
- topic tree/list
- create topic
- edit topic
- delete topic
- audit view
- split-plan view

### Words
- list words
- search words
- filter by topic
- create word
- edit word
- delete word
- workbook import/export actions

### Smart Review
- queue view
- item completion controls
- refresh queue control
- empty/disabled states

### Trash
- deleted words list
- deleted topics list
- restore actions
- purge action with caution

### Stats
- overview cards
- topic progress view
- usage charts/tables
- consistency/retention/efficiency summaries

### AI tools
- suggest topic interaction
- AI curation export/import views
- AI review workflow views if retained in product scope

## Frontend behavioral rules

- use authenticated session state from backend
- handle 401 by redirecting to login
- pass CSRF token on protected writes
- do not re-implement business rules only in UI
- show backend validation errors clearly
