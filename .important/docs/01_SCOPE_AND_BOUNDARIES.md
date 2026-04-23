# Scope and Boundaries

## In scope now

### Authentication and session
- single-password login
- session check endpoint
- logout
- CSRF verification on protected routes

### Topics
- list topics
- get topic by id
- create topic
- update topic
- soft delete topic
- topic sidebar stats
- topic audit
- topic split-plan generation

### Words
- list words
- filter by topic
- search by keyword
- get word by id
- create word
- update word
- soft delete word
- XLSX import/export
- AI review export/import
- bulk API-key-based word import
- AI topic suggestion
- AI curation export/import

### Smart review
- get or create active queue
- refresh queue
- complete queue item
- per-level quotas
- cooldown logic
- TTL-based queue lifecycle
- topic cap balancing

### Trash
- list deleted words
- list deleted topics
- restore deleted word
- restore deleted topic
- purge trash

### Stats
- overview metrics
- level counts
- topic progress stats
- daily activity
- usage summary
- retention summary
- efficiency summary
- consistency summary
- queue summary
- usage event recording

## Explicitly out of scope unless stated otherwise

- multi-user accounts
- sign-up flows
- social features
- payments
- collaborative learning
- spaced repetition engine beyond current smart-review rules
- arbitrary file imports beyond supported formats
- real-time sync across multiple clients
- native mobile apps
- public API beyond current internal/personal surfaces

## Boundary rules for AI agents

Agents must not invent new product capabilities unless:
- they are already visible in code/config
- or they are explicitly requested in a separate requirements change
