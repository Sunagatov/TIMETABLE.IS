# Functional Requirements

## FR-01 Input channels

The system shall accept:

- Telegram text messages
- Telegram voice messages

## FR-02 Telegram identity restriction

The bot shall process messages only from the configured owner Telegram user ID.

## FR-03 Immediate bot acknowledgement

After valid receipt, the bot shall send:

`Accepted. Processing asynchronously. Mindraft ID: ...`

## FR-04 One message = one item

Each Telegram message shall map to exactly one Memora item in V1.

## FR-05 Backend source of truth

Backend shall own:

- item lifecycle
- type/category/priority decisions
- review queues
- approved knowledge base
- failure handling
- auth/session logic

## FR-06 Review-first trust model

AI-processed items shall not immediately enter the approved knowledge base.

They shall first appear in **Needs Review**.

## FR-07 Needs Review actions

The reviewer shall be able to:

- approve as is
- edit then approve
- reject
- delete to trash
- retry processing

## FR-08 Main approved list

The default main list shall contain only approved items.

## FR-09 Failures area

The system shall provide a dedicated failures area.

## FR-10 Search/filter/sort

The web app shall support:

- keyword search across title + cleaned text + raw text/transcript
- filters by date, type, status, category tree, priority
- sorting by title and creation date

## FR-11 Category tree

The system shall support exactly 3 category levels:

- category
- subcategory
- subsubcategory

## FR-12 Category management

V1 shall support:

- create category
- rename category
- move items between categories
- delete category only if empty

## FR-13 Type enum in V1

Allowed item types:

- `IDEA`
- `THOUGHT`
- `REMINDER`
- `OTHER`

## FR-14 Type fallback

If AI is uncertain about type, it shall use `OTHER`.

## FR-15 Category fallback

If AI cannot confidently map to an existing category path, it shall use the configured default category path.

## FR-16 Priority fallback

If AI confidence is low, priority shall be `NOT_APPLICABLE`.

## FR-17 Telegram metadata persistence

For voice items, the system shall persist enough Telegram metadata for traceability, including:

- message ID
- file ID
- file unique ID
- generated Mindraft ID
- media metadata when available

## FR-18 Human edits after approval

Human edits to an already approved item shall keep the item approved automatically in V1.

## FR-19 Version visibility

UI shall preserve and expose:

- original AI output
- latest human version

## FR-20 Vault boundary

Application code and product docs belong here.

Deployment/runtime/prod files belong in Vault.
