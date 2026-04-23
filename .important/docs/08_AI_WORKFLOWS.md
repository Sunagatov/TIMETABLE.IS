# AI Workflows

## AI Topic Suggestion

### Purpose
Suggest an existing topic for a term/translation pair.

### Input
- term
- translation

### Output
- topic name

### Failure modes
- AI not configured
- no topics exist
- AI returned unknown topic
- AI returned malformed response
- AI timeout
- AI HTTP failure
- AI connection failure

### Product rule
The returned topic must be an existing known topic. AI must not invent arbitrary topic names for this endpoint.

## AI Review Export/Import

### Purpose
Allow topic-scoped AI assistance for word enrichment/review in a structured round-trip format.

### Agent rule
Import/export contracts must be treated as strict schemas, not loose text prompts.

## AI Curation Export/Import

### Purpose
Support larger maintenance flows where AI helps create topics, enrich words, and reorganize topic assignments.

### Export shapes
- full export
- lean export
- lean export with `needs_examples_only`

### Import operations
- create topic
- update existing word
- create new word
- reassign word topics

### Important agent rule
Import payloads must remain schema-valid. Agents must never assume backend will “do the right thing” with partially valid free-form JSON.

## AI provider model

Current configuration expects an OpenAI-compatible API endpoint with:
- API key
- base URL
- model name

## Non-goals
The docs do not assume any provider-specific prompt internals that are not visible in the repo surface.
