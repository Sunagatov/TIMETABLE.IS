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
- AI type suggestion
- AI category path suggestion from existing categories only
- AI priority suggestion only if confidence is high

### Web app
- password login
- Needs Review area
- Failures area
- approved list
- item detail/edit view
- search / filter / sort
- category tree sidebar
- category management

### Review actions
- approve as is
- edit then approve
- reject
- delete to trash
- retry processing
- manually change category path
- manually change type
- manually change priority

## Out of scope for initial V1 MVP

- question-answering workflow
- QUESTION type
- labels
- view-count sorting
- AI-created new categories requiring approval
- regeneration of AI outputs
- semantic search
- mobile app
- multi-user support
- signup/user management
- public sharing
- analytics dashboards
- reminders/calendar integration
- Memora-managed audio object storage
- audio playback in web app
- audio download in web app

## Accepted V1 limitations

- original audio remains in Telegram, not Memora-managed storage
- only Telegram references/IDs are persisted for voice traceability
- full audio-based retry/reprocessing is intentionally limited
- sensitive-content fine-grained controls are not part of V1
