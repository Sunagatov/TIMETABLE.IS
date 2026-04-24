# Functional Requirements

## FR-01 Telegram acceptance
The Telegram bot shall accept input only from the configured owner Telegram user ID.

## FR-02 One message = one item
Each Telegram message shall produce exactly one Memora item.

The system shall not split one message into multiple items in V1.

## FR-03 Immediate acknowledgement
After accepting a Telegram message, the bot shall send:

`Accepted. Processing asynchronously. Memora ID: ...`

## FR-04 Async processing
Memora shall process captured items asynchronously.

## FR-05 Voice processing
For voice items, Memora shall:
- persist Telegram references/metadata
- retrieve audio from Telegram
- transcribe the audio
- persist raw transcript
- run AI cleanup/classification
- place result into review or failure path

Current bootstrap limitation:
- voice acceptance may stop at durable metadata persistence and route to visible retryable transcription failure until the transcription slice is implemented.

## FR-06 Text processing
For text items, Memora shall:
- persist raw input text
- run AI cleanup/classification
- place result into review or failure path

## FR-07 Cleaned text generation
Memora shall generate cleaned text that:
- improves readability and natural English quality
- stays semantically close to user meaning
- does not silently replace intended meaning with “corrected” meaning

## FR-08 AI title
Memora shall generate a concise title candidate.

## FR-09 AI type
Memora shall infer initial type from the V1 enum.
If uncertain, use `OTHER`.

## FR-10 AI category path
Memora shall choose a category path only from pre-existing categories.
If no suitable category exists, use default category path.

## FR-11 AI priority
Memora shall suggest priority only if confidence is high.
Otherwise use `NOT_APPLICABLE`.

## FR-12 Needs Review area
Memora shall provide a dedicated Needs Review area.

## FR-13 Failures area
Memora shall provide a dedicated Failures area.

## FR-14 Approved list
Memora shall provide a main approved list containing only human-approved items by default.

## FR-15 Review actions
The review UI shall support:
- approve as is
- edit then approve
- reject
- delete to trash
- retry processing
- manual change of category path
- manual change of type
- manual change of priority

## FR-16 Approved-item editing
Approved items shall remain editable later.

Human edits shall keep the item approved automatically in V1.

## FR-17 Search
The main search bar shall search across:
- title
- cleaned text
- raw transcript
- raw input text

## FR-18 Filtering
The web UI shall support filtering by:
- creation date range
- category
- subcategory
- subsubcategory
- type
- status
- priority
- keyword

## FR-19 Sorting
The web UI shall support sorting by:
- title ascending/descending
- category ascending/descending
- creation date oldest/newest

## FR-20 Category management
V1 shall support:
- create category
- rename category
- move items between categories
- delete category only if empty

## FR-21 Traceability for voice items
For voice items, Memora shall persist enough Telegram metadata for traceability and limited recovery, including:
- Telegram message ID
- Telegram file ID
- Telegram file unique ID
- Memora item ID
- basic media metadata if available

## FR-22 Failure notifications
On failure, the bot shall send useful operational information including at least:
- Memora ID
- failed stage
- summary
- retry context if available
