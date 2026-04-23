# Stats and Tracking Specification

## Purpose

Stats support the user’s understanding of:
- vocabulary size
- progress quality
- weak vs strong knowledge
- enrichment gaps
- activity consistency
- usage efficiency
- queue behavior

## Top-level stats areas

### Overview
Contains:
- total words
- total topics
- example coverage
- POS coverage
- enrichment gap counts

### Level counts
Breaks vocabulary by knowledge levels including unset.

### Usage summary
Contains:
- total active seconds
- active days
- sessions
- average session seconds
- longest session
- today activity
- last 7d activity

### Retention summary
Contains:
- active/reviewed/never-reviewed words
- improved/regressed words
- strong/weak words
- parked words
- percentage shares

### Efficiency summary
Contains activity-normalized rates such as:
- reviews per active minute
- improved events per active minute
- net events per active minute
- reviewed words per session

### Consistency summary
Contains streaks and active/study day counts for recent windows.

### Queue summary
Contains:
- total queues
- active queues
- completed queues
- completion rate
- average queue size
- completion ratio
- average completion time

### Topics
Each topic stat includes:
- total
- progress
- weak/strong counts
- missing example counts
- reviewed/regressed counts
- never reviewed counts

### Daily activity and usage charts
Support historical timeline rendering.

## Usage event recording
Frontend sends usage events with:
- event key
- session key
- optional route
- active seconds

## Agent rule
Stats docs should be treated as behavior contracts for frontend rendering and backend compatibility, not merely analytics decoration.
