# Processing Pipeline

## Voice item flow

1. receive Telegram update
2. validate owner user ID
3. create item + Mindraft ID
4. persist Telegram references
5. send immediate acknowledgement
6. fetch Telegram file
7. transcribe audio
8. persist raw transcript
9. run AI cleanup/classification
10. persist AI snapshot
11. move item to `AI_PROCESSED_UNREVIEWED`

## Text item flow

1. receive Telegram update
2. validate owner user ID
3. create item + Mindraft ID
4. persist raw input text
5. send immediate acknowledgement
6. run AI cleanup/classification
7. persist AI snapshot
8. move item to `AI_PROCESSED_UNREVIEWED`

## Fallbacks

### Type

If uncertain: `OTHER`

### Category

If no suitable category path exists: configured default path

### Priority

If uncertain: `NOT_APPLICABLE`

## Accepted V1 limitation

Memora does not store audio in its own managed storage in V1.

Audio remains in Telegram. Memora stores only the references and metadata needed for traceability.
