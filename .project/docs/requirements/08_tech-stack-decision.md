# Tech Stack Decision

## Chosen stack

### Backend
- Kotlin 2.3.10
- Java 25 (LTS)
- Spring Boot 4.0.5
- Spring Security
- Spring Validation
- Spring Data MongoDB as target persistence support
- Gradle Kotlin DSL

### Frontend
- React 19.2.1
- TypeScript 6.0.2
- Vite 8.0.8
- TanStack Query 5.99.1
- React Hook Form 7.73.0
- Zod 4.3.6
- Tailwind CSS 4.2.2

### Telegram bot
- Kotlin 2.3.10
- Java 25
- TelegramBots 9.2.0

## Structure decision

### Backend
Use feature/domain/area-oriented package structure.

Examples:
- `auth`
- `capture`
- `item`
- `review`
- `health`

### Frontend
Use:
- `features/*`
- `shared/*`
- `app/*`

### Telegram bot
Use:
- `bot`
- `command`
- `backend`
- `ingest`
- `config`

## Persistence decision

Persistence is MongoDB for the active runtime.

In-memory stores exist only for focused tests and explicitly configured local development.
