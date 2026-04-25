# Functional Requirements

## FR-01 Capture input
Memora shall accept Telegram text messages and Telegram voice messages from the configured owner Telegram user id.

## FR-02 Backend source of truth
Backend shall own item lifecycle, review state, auth state, and accepted item records.

## FR-03 Telegram bot role
Telegram bot shall remain a thin adapter. It must not become a second backend.

## FR-04 Immediate acknowledgement
Accepted Telegram messages shall receive an acknowledgement that includes:
- accepted status
- asynchronous processing notice
- stable Memora item id

## FR-05 Review-first trust
Newly processed items shall land in review queues before becoming approved knowledge.

## FR-06 Queues
The system shall expose:
- needs review queue
- failures queue
- approved items view

## FR-07 Auth
Frontend shall use password-based login with backend-managed session.

## FR-08 Category path
Items shall have:
- category
- subcategory

## FR-09 Backend reuse
Business logic shall be reusable by future clients beyond Telegram.

## FR-10 Voice bootstrap rule
Current starter implementation may persist accepted voice metadata before the full transcription slice is implemented.

This is acceptable in bootstrap state and must be documented clearly.
