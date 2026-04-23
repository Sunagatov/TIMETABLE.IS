# AI Behavior Rules

## AI may do in V1

- improve grammar and clarity
- generate a concise title
- infer item type
- infer category path from existing categories
- suggest priority only if confidence is high

## AI must not do in V1

- create new categories
- answer questions
- add labels
- run regeneration flows
- silently rewrite the user's intended meaning

## Meaning-preservation rule

AI may polish the language, but it must stay semantically close to the user's intended meaning.

## Confidence rules

### Type

If uncertain -> `OTHER`

### Category

If no good fit -> default category path

### Priority

If low confidence -> `NOT_APPLICABLE`
