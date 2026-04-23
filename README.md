# Lexora

**Lexora** is a personal English vocabulary learning app focused on fast topic-based study, practical word management, and smart review.

This repository is a **monorepo** containing the backend, frontend, and project docs used by both humans and coding agents.

---

## Product purpose

Lexora exists to make English vocabulary study feel practical instead of chaotic.

The current product direction emphasizes:

- topic-based study
- fast review loops
- word-by-word progress updates
- quick CRUD workflows for words and topics
- smart review queues
- operationally safe AI-assisted enrichment

---

## Runtime shape

### Local development

- Postgres runs in Docker
- backend serves FastAPI on `:8000`
- frontend serves Vite/React on `:5173`

### Main repository areas

- `backend/` — FastAPI app, feature logic, DB models, auth, AI curation, smart review
- `frontend/` — React app, routes, study flows, editing UI, shared HTTP client
- `docs/ai/` — compact repo context and operating rules for coding agents
- `.claude/generated/request-routing.md` — quick routing file for narrow-context work

---

## Quick start

### Prerequisites

- Docker Desktop
- Node.js 20+
- npm
- Python 3.12+ only if you want to run backend outside Docker

### 1. Clone the repository

```bash
git clone https://github.com/Sunagatov/Lexora.git
cd Lexora
```

### 2. Configure environment

```bash
cp .env.example .env
# then set at least:
# APP_PASSWORD
# SECRET_KEY
# API_KEY
# OPENAI_API_KEY (if using topic suggestion or AI curation)
```

### 3. Start with Docker Compose

```bash
docker compose up --build
```

### 4. Open the app

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

---

## Auth model at a glance

Lexora uses **session-cookie auth** for normal protected routes.

Typical flow:

1. log in with `POST /auth/login`
2. backend sets session cookie and returns `csrf_token`
3. frontend stores the CSRF token
4. protected requests send:
   - session cookie
   - `X-CSRF-Token` header

Bulk import paths may also require `X-Api-Key`.

Do not redesign this casually. It is a core project contract.

---

## Read this before making changes

### For humans

Start with:

1. `AGENTS.md`
2. the smallest relevant scoped file:
   - `backend/AGENTS.md`
   - `frontend/AGENTS.md`
   - `docs/ai/ai-curation-workflow.md`
3. only the exact source files involved in the task

### For Claude CLI / Codex CLI

Use the same narrow read order.  
Do **not** scan the entire repository by default.

Important helper docs:

- `docs/ai/repo-map.md`
- `docs/ai/architecture.md`
- `docs/ai/api-surface.md`
- `docs/ai/env-reference.md`
- `docs/ai/context-budget-rules.md`

---

## Key product capabilities already present

Confirmed feature families include:

- auth
- health
- topics
- words
- smart review
- trash
- stats
- AI topic suggestion
- AI curation/import tooling for vocabulary enrichment

---

## AI-assisted areas

Lexora already has two important AI-related workflows:

### 1. Topic suggestion during word creation
The backend can suggest a topic for a word + translation pair.

### 2. AI curation / enrichment
The backend and `docs/ai/` include a workflow for:

- exporting topic words
- enriching example sentences
- dry-run imports
- live imports
- safe topic splitting and reassignment

Before changing any AI path, read:

- `docs/ai/ai-cost-reduction-backlog.md`
- `docs/ai/ai-curation-workflow.md`
- `docs/ai/example-style-guide.md`

---

## Validation philosophy

Use the **smallest relevant validation first**.

### Backend-only

```bash
cd backend
python -m pytest
ruff check .
```

### Frontend-only

```bash
cd frontend
npm test
npm run lint
npm run build
```

Do not jump to full-repo validation if the change is narrow.

---

## Non-goals for normal work

Avoid these by default:

- scanning the whole repo before understanding the task
- broad refactors without concrete evidence
- touching auth/CSRF/session plumbing unless required
- inventing new abstractions for speculative future use
- changing prod data flows casually
- using local DB exports for prod imports

---

## Important operational note

For production work, **Vault is the source of truth** for:

- secrets
- deploy tasks
- SSH access
- prod automation
- prod logs

Do not assume repo-local `.env` files are valid for prod work.

---

## Documentation intent

The docs in this repo are intentionally optimized for:

- low-token AI work
- minimal assumptions
- stable invariants
- predictable change plans
- safe prod-adjacent workflows
