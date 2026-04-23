# AI-Assisted Workflows

## General posture

AI is used to accelerate curation, not to bypass validation.

## Workflow A — Suggest Topic

### Input
- term
- translation

### Output
- topic_name

### Hard rules
- result must map to an existing topic
- unknown topic is an error, not silent auto-creation
- malformed AI output is an error
- timeout and upstream API failures must be surfaced clearly

## Workflow B — AI Review Export/Import
The backend exposes an AI review export/import path for topic-scoped word review.

Documentation and implementation must preserve:
- explicit topic scoping
- page-based export/import handling
- validation on import

## Workflow C — AI Curation Export/Import

### Export modes
- full mode
- lean mode

### Lean mode intent
Designed for external AI enrichment with minimal fields.

### Import operation classes
- create_topic
- word_update
- word_create
- word_reassign

### Import safety requirements
- support dry run
- support strict mode
- require non-empty operation set
- validate references and enumerations
- report created/updated/reassigned/unchanged counts

## AI configuration
The backend currently expects OpenAI-compatible settings:
- API key
- base URL
- model name

## Explicit non-goals
- no silent autonomous mass mutation without import contract
- no free-form AI writes directly to DB
- no undocumented prompt-side behavior assumptions in requirements
