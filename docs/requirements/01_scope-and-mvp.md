# Scope and MVP

## In scope for V1

### Capture

- Telegram voice messages
- Telegram text messages
- Telegram bot accepts only the configured owner user ID
- immediate acknowledgement with stable Mindraft ID

### Processing

- asynchronous processing model
- voice transcription
- AI cleanup / language polishing
- AI title suggestion
- AI type suggestion
- AI category selection from existing categories only
- AI priority suggestion only when confidence is high

### Web app

- login screen
- Needs Review page
- Failures page
- approved items list
- item details
- edit + approve flow
- basic keyword search
- filtering
- sorting
- category sidebar
- category management within V1 scope

### Backend

- source of truth for business logic
- session-based auth
- Telegram ingest endpoint
- list/review endpoints
- category endpoints
- clear item status lifecycle

### Telegram bot

- thin Kotlin adapter
- forwards accepted content to backend
- replies with accepted message + Mindraft ID
- sends failure information when backend indicates it

## Out of scope for V1

- deployment/runtime files in this repo
- multi-user support
- public sharing
- question-answering workflow
- labels
- regeneration workflows
- AI-created categories
- semantic search
- Memora-managed audio object storage
- audio playback/download in web app
