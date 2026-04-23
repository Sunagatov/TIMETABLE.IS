# Functional Requirements

## Capture

1. The system shall accept Telegram text and voice messages from exactly one allowed Telegram user ID.
2. The Telegram bot shall acknowledge accepted input immediately with a stable Memora item ID.
3. The Telegram bot shall process messages asynchronously.
4. Each Telegram message shall create exactly one Memora item.

## Processing

5. Voice items shall be transcribed.
6. The system shall store Telegram references and processing metadata for voice items.
7. The system shall clean text using AI while preserving original meaning.
8. The system shall assign an initial type from IDEA / THOUGHT / REMINDER / OTHER.
9. If type confidence is insufficient, the system shall assign OTHER.
10. The system shall assign a category path using only pre-existing categories; otherwise it shall use the default category path.
11. The system shall suggest priority only if confidence is high; otherwise NOT_APPLICABLE.

## Review

12. AI-processed items shall remain outside the main approved list until human approval.
13. The web app shall provide separate Needs Review and Failures areas.
14. A reviewer shall be able to approve as-is, edit and approve, reject, delete, or retry processing where applicable.
15. Approved items shall remain editable later by the human user.
16. Human edits to approved items shall keep the item approved.

## Category management

17. The web app shall allow create, rename, reassign items, and delete-empty-category operations.
18. The category model shall support exactly three levels.

## Search and browse

19. The main approved list shall contain only human-approved items by default.
20. Search shall run across title, cleaned text, raw text/transcript where present.
