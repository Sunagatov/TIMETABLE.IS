# Tech Stack Decision

## Chosen stack

### Backend

- Kotlin **2.3.10**
- Java **25** (LTS)
- Spring Boot **4.0.5**
- Gradle Kotlin DSL
- Spring Security
- MongoDB support

### Frontend

- React **19.2.1**
- TypeScript **6.0.2**
- Vite **8.0.8**
- TanStack Query **5.99.1**
- React Hook Form **7.73.0**
- Zod **4.3.6**
- Tailwind CSS **4.2.2**

### Telegram bot

- Kotlin **2.3.10**
- Java **25**
- TelegramBots **9.2.0**
- plain Kotlin thin adapter (not Spring Boot)

## Why this stack

### Backend

Kotlin + Spring Boot keeps the backend:

- valuable for the job market
- familiar to the human maintainer
- easy for AI agents to navigate
- strong for client-agnostic business logic

### Frontend

React + Vite + TypeScript gives:

- low ambiguity
- strong AI-agent familiarity
- easy local startup
- easy incremental UI slices

### Telegram bot

Kotlin keeps the language close to backend ownership while still allowing a thin transport-focused adapter.

### MongoDB

MongoDB gives a practical document-model fit for early item storage while still being common and useful experience.
