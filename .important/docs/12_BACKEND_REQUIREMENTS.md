# Backend Requirements

## Architectural role

The backend is the source of truth for:
- auth/session validation
- topic lifecycle
- word lifecycle
- smart review generation
- trash/restore rules
- stats computation
- AI integration contracts

## Required backend qualities

- explicit domain validation
- clear HTTP error mapping
- stable request/response schemas
- config-driven smart review behavior
- no hidden side effects beyond documented flows

## Domain service expectations

### Topics
Backend must preserve:
- name/slug validation
- parent validity
- conflict detection
- child-topic deletion protection

### Words
Backend must preserve:
- topic existence validation
- duplicate word/topic conflict detection
- update semantics that reject explicit nulls where omission is required
- word restore safety rules

### Smart review
Backend must preserve:
- cooldown exclusion
- topic cap balancing
- TTL logic
- completed queue regeneration
- stale queue regeneration

### AI integrations
Backend must preserve strict contract validation around:
- AI topic suggestion
- AI review import/export
- AI curation import/export

### Trash
Backend must preserve:
- soft delete semantics
- restore conflict handling
- purge retention semantics

## Agent constraint

Do not “simplify” the backend in ways that remove business rules that are already encoded in services and routers.
