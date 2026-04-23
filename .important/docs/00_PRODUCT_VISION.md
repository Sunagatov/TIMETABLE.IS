# Memora — Product Vision

## Product Summary

Memora is a personal English vocabulary learning system focused on topic-based study, fast review, practical progress tracking, and low-friction data curation.

The product combines:

- a FastAPI backend
- a future React/Vite frontend
- PostgreSQL persistence
- optional AI-assisted workflows for topic suggestion and vocabulary curation

## Core Product Promise

Memora should help the user:

- organize vocabulary by topic hierarchy
- create, update, import, export, and review words efficiently
- keep vocabulary quality high over time
- measure learning progress with clear metrics
- avoid losing work through soft-delete and restore flows
- accelerate curation with AI without losing human control

## Primary Product Shape

Memora is not a generic language-learning social app.

It is a **single-user, owner-operated vocabulary workspace** with strong CRUD, review, import/export, and observability features.

## Primary User

V1 assumes one owner-user with full access to the system.

No public signup or multi-tenant support is required.

## Product Goals

1. Provide a reliable topic-centric vocabulary database.
2. Make word review and progress updates fast.
3. Support efficient bulk ingestion and curation.
4. Support AI as an assistant, not as an autonomous authority.
5. Preserve user control over topic structure and word quality.

## Non-Goals for current V1

- social features
- public sharing
- collaborative editing
- teacher/student roles
- gamified leaderboards
- offline-first synchronization
- mobile-native apps
- multilingual UI management
