# AI Behavior Rules

## Purpose

AI in Memora is an assistant for:
- polishing language
- structuring content
- classifying content
- answering questions

It is not an authority that should replace the user's meaning.

## Allowed AI responsibilities in V1

- improve English fluency and readability
- generate a concise title
- infer item type (including `QUESTION`)
- generate an answer when item type is `QUESTION` (model knowledge only)
- infer category path from existing categories when a good match exists
- suggest a new 2-level category path when no existing path fits
- suggest priority when confidence is high
- regenerate AI outputs (cleaned text, answer, category proposal) when requested

## Behavior constraints

### Preserve intended meaning
AI must stay semantically close to the user's intended meaning.
The cleaned text should feel like the same thought expressed in fluent natural English, not a summary or a simplified note.

### Improve language, not worldview
AI may improve language quality and clarity.
It should not inject disagreement, moral commentary, ideological correction, or refusal-style meta-commentary into the cleaned text.

### No silent meaning substitution
If the user says something wrong, speculative, exaggerated, or subjective, AI should not silently rewrite it into a corrected factual claim.

### Category preference order
1. Match an existing category path if a good fit exists.
2. If no existing path fits, suggest a new 2-level path requiring human approval.
3. If uncertain, fall back to default category path.

### Answer behavior for QUESTION items
- Generate answer from model knowledge only.
- Do not refuse to answer or inject refusal meta-commentary into the stored answer.
- If answer cannot be generated, record the failure; the item must survive.
- Web-search-backed answers are out of scope for V1.

### Fallback rules
- If uncertain about type → `OTHER`
- If uncertain about category → default category path (do not invent a new one if confidence is too low)
- If uncertain about priority → `NOT_APPLICABLE`

## Out of scope in V1

- web-search-backed question answers
- labels
- semantic search
- idea linking / related-ideas suggestions
