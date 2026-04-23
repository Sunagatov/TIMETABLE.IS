# Processing Pipeline

## Overview

Memora uses an asynchronous pipeline.

Telegram capture must not wait for full completion.

## Pipeline for voice items

1. Receive Telegram update
2. Validate Telegram sender
3. Create item + Memora ID
4. Persist Telegram references and metadata
5. Acknowledge in Telegram
6. Retrieve audio using Telegram references
7. Transcribe audio
8. Persist raw transcript
9. Run AI cleanup/classification
10. Persist AI output
11. Move item to `AI_PROCESSED_UNREVIEWED`

## Pipeline for text items

1. Receive Telegram update
2. Validate Telegram sender
3. Create item + Memora ID
4. Persist raw input text
5. Acknowledge in Telegram
6. Run AI cleanup/classification
7. Persist AI output
8. Move item to `AI_PROCESSED_UNREVIEWED`

## AI output expected in V1

- title
- cleaned text
- type
- category path
- priority when confidence is high

## Fallback rules

### Type fallback

If uncertain:
- use `OTHER`

### Category fallback

If no good match exists:
- use configured default category path

### Priority fallback

If confidence is low:
- use `NOT_APPLICABLE`

## Accepted V1 limitation

Memora does not manage its own audio storage in V1.

Audio remains in Telegram. Memora stores Telegram references and processing metadata only.
