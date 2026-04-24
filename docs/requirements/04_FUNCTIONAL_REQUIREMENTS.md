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
- does not silently replace intended meaning with "corrected" meaning
- does not inject moral commentary, ideological correction, or refusal-style meta-commentary

## FR-08 AI title
Memora shall generate a concise title candidate.

## FR-09 AI type
Memora shall infer initial type from the V1 enum: `IDEA`, `THOUGHT`, `QUESTION`, `REMINDER`, `OTHER`.
If uncertain, use `OTHER`.
`QUESTION` is a V1 type, not a future feature.

## FR-10 AI category path
Memora shall:
1. Try to match an existing category/subcategory/subsubcategory path.
2. If no existing path fits, AI may suggest a new 3-level category path.
3. Suggested new paths must be reviewed and approved by the human during item review.
4. Once the human approves a suggested path, it becomes permanently reusable.
5. If category inference fails or confidence is too low, use the default category path.

AI-created category proposals requiring human approval are a V1 feature, not future-only.

## FR-11 AI priority
Memora shall suggest priority only if confidence is high.
Otherwise use `NOT_APPLICABLE`.

## FR-12 QUESTION answering
When AI infers item type `QUESTION`, Memora shall also generate an answer using model knowledge.

Answer must be:
- stored with the item
- visible during review
- editable by the user
- rejectable/deletable by the user
- regeneratable by the user

If answer generation fails, the item must still be created and the failure must be visible and retryable.

Answer source in V1: model knowledge only. Web-search-backed answers are future.

## FR-13 AI output regeneration
Memora shall support regeneration of AI outputs:
- cleaned text (also regenerates AI title since both derive from the same input)
- answer (for QUESTION items)
- category path proposal
- all AI outputs as one combined action: title, cleaned text, type, answer if QUESTION, category/category proposal, priority

Regeneration must:
- preserve the original AI output (ai* fields) — they represent the first AI run
- update the current working values (title, cleanedText, answer, etc.)
- keep the item in its current review/approval state
- not silently overwrite the item into an inconsistent state

AI output regeneration is a V1 feature, not future-only.

## FR-14 Needs Review area
Memora shall provide a dedicated Needs Review area for items in `AI_PROCESSED_UNREVIEWED` state.

## FR-15 Failures area
Memora shall provide a dedicated Failures area for items in failure states.

## FR-16 Approved list
Memora shall provide a main approved list containing only human-approved items by default.

## FR-17 Review actions
The review UI shall support:
- approve as is
- edit then approve
- reject
- delete to trash
- retry processing
- manual change of category path
- manual change of type
- manual change of priority
- approve or override AI-proposed new category path
- for `QUESTION` items:
  - view AI-generated answer
  - edit answer
  - reject/delete answer
  - regenerate answer

## FR-18 Approved-item editing
Approved items shall remain editable later.

Human edits shall keep the item approved automatically in V1.

## FR-19 Search
The main search bar shall search across:
- title
- cleaned text
- raw transcript
- raw input text
- answer (for QUESTION items)

## FR-20 Filtering
The web UI shall support filtering by:
- creation date range
- category
- subcategory
- subsubcategory
- type
- status
- priority
- keyword

## FR-21 Sorting
The web UI shall support sorting by:
- title ascending/descending
- category ascending/descending
- creation date oldest/newest

## FR-22 Category management
V1 shall support:
- create category
- rename category (cascade rename to items using that path)
- move items between categories
- delete category only if empty (blocked if any item uses it)

## FR-23 Traceability for voice items
For voice items, Memora shall persist enough Telegram metadata for traceability and limited recovery, including:
- Telegram message ID
- Telegram file ID
- Telegram file unique ID
- Memora item ID
- basic media metadata if available

## FR-24 Failure notifications
On failure, the bot shall send useful operational information including at least:
- Memora ID
- failed stage
- summary
- retry context if available
