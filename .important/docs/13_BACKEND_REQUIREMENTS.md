# Backend Requirements

## Architectural style

The backend should remain the source of truth for:
- domain validation
- lifecycle rules
- queue rules
- restore/delete safety
- AI import/export contracts

## Module boundaries to preserve

- auth
- health
- topics
- words
- smart_review
- trash
- stats
- ai_curation
- shared config/deps

## Backend priorities for AI agents

1. preserve current route contracts unless intentionally versioned
2. keep error semantics explicit
3. avoid leaking infrastructure details into domain rules
4. keep import/export flows deterministic
5. document all config-driven behaviors

## Data integrity priorities

- block invalid parent-topic states
- block duplicate/conflicting word states
- block invalid restore states
- keep queue state consistent
- keep soft-delete semantics reversible until purge

## API evolution guidance

When changing contracts, prefer:
- additive changes first
- explicit versioning for disruptive curation formats
- docs update in the same change
