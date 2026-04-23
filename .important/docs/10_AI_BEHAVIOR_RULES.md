# AI Behavior Rules

## Purpose

AI in Memora is an assistant for structuring content, not an authority that replaces the user's meaning.

## Allowed AI responsibilities in V1

- improve readability and grammar of the user's content
- generate a concise title
- infer item type
- infer category path from existing categories
- suggest priority only when confidence is high

## AI behavior constraints

### Preserve intended meaning

The AI must stay semantically close to the user's intended meaning.

It should not silently replace the meaning with what the model thinks is “correct.”

### Improve language, not worldview

The AI may improve language quality and clarity.

It should not inject disagreement, moral commentary, or ideological correction merely because the user's content contains opinions, mistakes, subjective judgments, or emotionally charged wording.

### No forced factual correction of intent

If the user says something factually wrong, speculative, exaggerated, or emotional, AI should not silently rewrite it into a corrected factual claim unless explicitly instructed later in a different workflow.

### Category restriction

AI may select only from pre-existing categories in V1.

If uncertain:
- use default category path

### Type restriction

AI may assign:
- `IDEA`
- `THOUGHT`
- `REMINDER`
- `OTHER`

If uncertain:
- use `OTHER`

### Priority restriction

AI may suggest priority only when confidence is high.

If uncertain:
- use `NOT_APPLICABLE`
