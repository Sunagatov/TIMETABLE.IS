# Scope and MVP

## In scope for V1 MVP

### Capture

- Telegram voice messages as input
- Telegram text messages as input
- Bot accepts messages only from the owner's Telegram user ID
- Immediate Telegram acknowledgement:
  - `Accepted. Processing asynchronously. Memora ID: ...`

### Processing

- Asynchronous processing only
- Voice transcription
- Text cleanup / language polishing by AI
- Type suggestion by AI
- Category selection from pre-existing category tree
- Priority suggestion by AI if confidence is high
- Safe fallback values when AI is uncertain

### Review and management

- Separate **Needs Review** area
- Separate **Failures** area
- Main approved items list
- Review actions:
  - approve as is
  - edit then approve
  - reject
  - delete (to trash)
  - retry processing
  - move to default category if needed

### Search and browsing

- Search across title, cleaned text, raw text/transcript
- Filter by:
  - date/time range
  - category tree
  - type
  - status
  - priority
  - keyword
- Sort by:
  - title A-Z / Z-A
  - category A-Z / Z-A
  - creation date oldest first / newest first

### Category management

- create category
- rename category
- move items between categories
- delete category only if empty

### Auth and access

- single-user login
- password-based login screen
- backend-managed session
- configurable session lifetime, default 30 days
- auto-redirect to login on expired/invalid session

## Explicit V1 limitations

- no Memora-managed audio storage
- no audio playback in web app
- no audio download in web app
- no reliable audio reprocessing guarantee inside Memora itself
- question-answering functionality removed from initial V1 MVP
- labels out of scope
- regeneration workflows out of scope
- AI-created new categories out of scope
- view count tracking out of scope
- semantic search out of scope
- reminders/calendar integration out of scope

## Out of scope for V1

- multi-user support
- sign up / user management
- public sharing
- mobile app
- analytics dashboards
- idea graph / link graph
- advanced semantic search
- labels
- question-answering workflow
- AI-generated new categories requiring separate approval
- regeneration of AI content
- object storage for original audio
- rate limiting
- privacy controls per item
