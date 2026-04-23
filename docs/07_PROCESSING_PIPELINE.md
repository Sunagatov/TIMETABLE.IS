# Processing Pipeline

## Text input

1. Receive Telegram text
2. Persist item and metadata
3. Run AI cleaning/classification asynchronously
4. Store results
5. Move item to Needs Review or Failures

## Voice input

1. Receive Telegram voice message
2. Persist Telegram references and metadata
3. Download/process as needed for transcription
4. Persist raw transcript
5. Run AI cleaning/classification asynchronously
6. Store results
7. Move item to Needs Review or Failures

## V1 limitation

Memora does not store original audio in its own storage in V1.
