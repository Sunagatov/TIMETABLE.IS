# Backend

Kotlin + Spring Boot backend for Memora.

## Current intent

This backend is the source of truth for:

- auth/session handling
- item ingestion
- review/failure queues
- approved knowledge base
- category tree operations

## Local run

Prerequisites:

- Java 25
- Gradle available locally

Run:

```bash
cd backend
gradle bootRun
```

By default it starts on:

- `http://localhost:8080`

Health endpoint:

- `GET /api/health`

## Notes

The initial starter uses in-memory storage to keep local startup simple.

MongoDB support is already included in the stack decision and dependency set, but full persistence can be added in the next implementation step without changing the product contract.
