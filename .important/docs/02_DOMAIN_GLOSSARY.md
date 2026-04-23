# Domain Glossary

## Topic
A category-like grouping for words. Topics may be nested using `parent_topic_id`. Topics have name, slug, optional description, active flag, and soft-delete state.

## Word
The main study unit. A word can belong to multiple topics and includes lexical metadata, examples, translations, notes, and a knowledge level.

## Knowledge level
A numeric learning-progress indicator in range 1..5.

Current domain meaning:
- 1..4 = active study levels
- 5 = parked / excluded from smart review

## Smart review queue
A generated study queue with items selected from the vocabulary set according to configured level quotas, cooldown rules, TTL, and topic balancing.

## Queue item
A word selected into a specific smart review queue with order position and completion state.

## Trash
Soft-deleted storage state for topics and words. Trash supports listing, restore, and purge.

## AI topic suggestion
A workflow where AI maps a word candidate to an existing topic name.

## AI review export/import
A workflow for exporting topic words for AI-assisted review/enrichment and importing the reviewed payload back.

## AI curation export/import
A broader workflow for topic export/import that can create topics, create words, update words, and reassign topics.

## Sidebar stats
Aggregated stats used to render topic counts and topic progress in the navigation/sidebar experience.

## Progress
Weighted/computed representation of learning state for a topic or the whole vocabulary set.

## Usage event
A tracked frontend activity record used for usage-based stats, session summaries, and consistency metrics.
