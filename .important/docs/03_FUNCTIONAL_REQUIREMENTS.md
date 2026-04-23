# Functional Requirements

## FR-01 Capture channels

The system shall accept input from:

- Telegram voice messages
- Telegram text messages

The system shall not allow item creation from the web app in V1.

## FR-02 Telegram user restriction

The bot shall process messages only from the configured owner Telegram user ID.

Messages from any other Telegram user ID shall be ignored or rejected safely.

## FR-03 Immediate acknowledgement

After receiving a valid Telegram message, the bot shall send an acknowledgement message in Telegram.

The acknowledgement shall include:

- confirmation that the item was accepted
- that processing is asynchronous
- a stable Memora item ID

Example:

`Accepted. Processing asynchronously. Memora ID: MDR-2026-000123`

## FR-04 One message = one item

Each Telegram message shall produce exactly one Memora item.

The system shall not split one message into multiple items in V1.

## FR-05 Voice processing

For voice input, the system shall:

1. persist Telegram references and item metadata
2. obtain the audio file using Telegram references
3. transcribe the audio
4. store the raw transcript
5. send the content to AI cleanup/classification pipeline

## FR-06 Text processing

For text input, the system shall:

1. store the original text as raw input text
2. send the content to AI cleanup/classification pipeline

## FR-07 Cleaned text generation

The system shall generate cleaned text from the original content.

The cleaned text shall:

- improve English fluency and readability
- remain semantically close to the user's original meaning
- avoid silently changing the intended meaning

## FR-08 AI classification

The system shall attempt to infer:

- item title
- item type
- category
- subcategory
- subsubcategory
- priority if confidence is high

If type is uncertain, the system shall use `OTHER`.

If category assignment fails, the system shall use the configured default category path.

## FR-09 Category model

The system shall support exactly three category levels in V1:

- category
- subcategory
- subsubcategory

## FR-10 Category selection rule

In V1, AI shall choose only from pre-existing categories.

The system shall not auto-create new categories in V1.

If no suitable category exists, the system shall assign the default category path.

## FR-11 Review-first trust model

Fresh AI-processed items shall not automatically join the main approved knowledge base.

They shall first remain in the **Needs Review** area until human approval.

## FR-12 Review actions

For each item in review, the system shall support:

- approve as is
- edit then approve
- reject
- delete to trash
- retry processing
- manually change category path
- manually change type
- manually change priority

## FR-13 Approved items list

The main default list in the web app shall contain only human-approved items.

## FR-14 Review and failure areas

The web app shall provide:

- a dedicated **Needs Review** area
- a dedicated **Failures** area

Unapproved and failed items shall also be searchable/filterable intentionally through status filters.

## FR-15 Item editing

After approval, the human user shall be able to edit all fields of the item.

Human edits to an approved item shall not move it back to Needs Review in V1.

## FR-16 Version visibility

For each item, the system shall preserve at least:

- original AI-generated output
- latest human-edited version

The UI shall display both versions.

## FR-17 Search

The web app shall support keyword search across:

- title
- cleaned text
- raw transcript
- raw input text

Semantic search is out of scope for V1.

## FR-18 Filtering

The web app shall support filtering by:

- creation date range
- category
- subcategory
- subsubcategory
- type
- status
- priority
- keyword

## FR-19 Sorting

The web app shall support sorting by:

- title A-Z
- title Z-A
- category A-Z
- category Z-A
- creation date ascending
- creation date descending

## FR-20 Category management

The web app shall support category management operations:

- create category
- rename category
- move items between categories
- delete category if empty

Deleting a non-empty category shall be forbidden in V1.

## FR-21 Deletion behavior

Deleting an item shall move it to trash rather than hard-delete it immediately.

`REJECTED` and `DELETED` shall remain distinct states.

## FR-22 Failure notifications

If processing fails, the Telegram bot shall send a failure message containing as much useful operational information as reasonably possible in V1, including at least:

- Memora item ID
- failed stage
- human-readable failure summary
- retry status or retry count when available
- indication that the item is visible in Failures area

## FR-23 Telegram metadata persistence

For voice items, the system shall persist enough Telegram metadata for traceability and limited recovery, including:

- Telegram message ID
- Telegram file ID
- Telegram file unique ID
- generated Memora item ID
- available basic media metadata if present

## FR-24 Session-based access

The web app shall provide a password login screen.

Successful login shall create a backend-managed authenticated session.

## FR-25 Session expiry handling

If the session is invalid or expired, the frontend shall redirect the user to the login screen.

## FR-26 Dashboard

The default landing view shall be **Needs Review**.

The dashboard/list area shall include:

- search bar
- filters
- sorting controls
- item list
- category sidebar

## FR-27 Sidebar

The sidebar shall display the category tree as a collapsible tree with counts per node.

## FR-28 Client-agnostic backend

The backend shall expose business capabilities independently from Telegram-specific concerns.

Telegram shall be treated as an adapter/integration client, not the owner of core domain logic.
