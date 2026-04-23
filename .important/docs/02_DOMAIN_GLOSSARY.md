# Domain Glossary

## Topic
A named vocabulary grouping. Topics may form a hierarchy through `parent_topic_id`.

## Root Topic
A topic with no parent.

## Child Topic
A topic whose `parent_topic_id` points to another topic.

## Word
A vocabulary record that can belong to one or more topics.

## Knowledge Level
An integer from 1 to 5 representing current familiarity/study state.

## Parked Word
A word at knowledge level 5. In current backend constraints, level 5 represents a rare/strange word excluded from Smart Review.

## Active Item
A topic or word with `deleted_at = null` and `is_active = true`.

## Deleted Item
A topic or word soft-deleted by setting `deleted_at`.

## Trash
The recoverable area for soft-deleted topics and words.

## Smart Review Queue
A generated queue of words selected by configured rules for focused review.

## Queue Item
A single word entry inside a Smart Review queue, with completion state and position.

## Topic Suggestion
An AI-assisted feature that maps a word + translation to one of the existing topics.

## AI Curation Export
A structured export of topic words for external AI-assisted enrichment and later re-import.

## Workbook Import/Export
Excel `.xlsx` based import/export flow for vocabulary data.

## Sidebar Stats
Topic-related aggregated counts used by the UI sidebar.

## Usage Event
A recorded frontend usage/activity signal used to compute productivity and engagement metrics.
