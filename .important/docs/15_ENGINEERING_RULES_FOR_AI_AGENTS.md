# Engineering Rules for AI Agents

## Primary goal

Help coding agents work with fewer assumptions, fewer clarifying questions, and less token waste.

## Required principles

### KISS
Prefer clear, direct implementations over abstract, future-proofed complexity.

### YAGNI
Do not introduce frameworks, layers, or abstractions that are not justified by current Lexora behavior.

### Preserve existing product rules
Do not silently remove or weaken domain rules already present in code.

## Specific guardrails

### 1. Do not invent product behavior
If behavior is not in docs or code, treat it as unknown, not as permission to invent.

### 2. Do not merge distinct concepts
Keep separate:
- session auth vs API key auth
- topic hierarchy vs word-topic assignment
- soft delete vs purge
- smart review queue vs manual word browsing
- AI topic suggestion vs AI curation

### 3. Keep files readable
Prefer understandable modules and explicit names.
Avoid giant files when practical.

### 4. Avoid hidden side effects
Side effects should be traceable in services and routes.

### 5. Keep request/response contracts strict
Pydantic schemas and validation rules are part of the product contract, not optional decoration.

### 6. Do not weaken restore/deletion safety
Trash and restore rules exist to protect data integrity.

### 7. Do not guess frontend behavior
Frontend must follow backend contracts, not re-interpret them.

## Definition of good change for Lexora
A good implementation change:
- reduces ambiguity
- preserves business rules
- improves readability
- does not introduce speculative architecture
- keeps future maintenance cheaper
