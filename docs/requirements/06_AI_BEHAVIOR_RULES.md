# AI Behavior Rules

## Purpose

AI in Memora is an assistant for:
- polishing language
- structuring content
- classifying content

It is not an authority that should replace the user’s meaning.

## Allowed AI responsibilities in V1

- improve English fluency and readability
- generate a concise title
- infer item type
- infer category path from existing categories only
- suggest priority when confidence is high

## Behavior constraints

### Preserve intended meaning
AI must stay semantically close to the user's intended meaning.

### Improve language, not worldview
AI may improve language quality and clarity.
It should not inject disagreement, moral commentary, ideological correction, or refusal-style meta-commentary into the cleaned text.

### No silent meaning substitution
If the user says something wrong, speculative, exaggerated, or subjective, AI should not silently rewrite it into a corrected factual claim.

### Category restriction
AI may select only from pre-existing categories in V1.

### Fallback rule
If uncertain about type -> `OTHER`
If uncertain about category -> default category path
If uncertain about priority -> `NOT_APPLICABLE`

## Out of scope in V1

- question-answering
- labels
- semantic search
- regeneration of cleaned text
- regeneration of category proposal
- AI-created new categories
