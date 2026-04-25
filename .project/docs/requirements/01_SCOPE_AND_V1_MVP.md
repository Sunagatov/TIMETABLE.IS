# Scope and V1 MVP

## In scope for initial V1 MVP

### Capture
- Telegram voice messages
- Telegram text messages

### Processing
- asynchronous processing
- voice transcription
- cleaned text generation
- AI title suggestion
- AI type suggestion (including `QUESTION` type)
- AI category path suggestion: prefer existing paths; if no suitable path exists, AI may suggest a new 3-level path requiring human approval
- AI priority suggestion only if confidence is high
- AI-generated answer for `QUESTION`-type items (model knowledge only)
- AI output regeneration (cleaned text, answer, category proposal)

### Web app
- password login
- Needs Review area
- Failures area
- approved list
- item detail/edit view
- search / filter / sort (including answer field in keyword search)
- category tree sidebar
- category management
- AI-proposed category approval during item review

### Review actions
- approve as is
- edit then approve
- reject
- delete to trash
- retry processing
- manually change category path
- manually change type
- manually change priority
- for `QUESTION` items:
  - view AI-generated answer
  - edit answer
  - reject/delete answer
  - regenerate answer

## Out of scope for initial V1 MVP

- labels
- view-count sorting
- web-search-backed question answers (model knowledge only in V1)
- semantic search
- mobile app
- multi-user support
- signup/user management
- public sharing
- analytics dashboards
- reminders/calendar integration
- Memora-managed audio storage
- audio playback in web app
- audio download in web app
- manual item creation from web app
- idea linking / related-ideas graph
- rate limiter

## Accepted V1 limitations

- original audio remains in Telegram, not Memora-managed storage
- only Telegram references/IDs are persisted for voice traceability
- full audio-based retry/reprocessing is intentionally limited
- sensitive-content fine-grained controls are not part of V1
- question answers are model-knowledge only; web-search-backed answers are future
