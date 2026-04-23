# telegram-bot/AGENTS.md

## Purpose

The Telegram bot is a thin Kotlin adapter.

## Responsibilities

- poll or receive Telegram updates
- validate owner user ID
- forward accepted content to backend
- send acceptance message with Mindraft ID
- send failure information when backend indicates it

## Rules

- do not move backend logic here
- do not invent domain rules here
- keep transport code explicit and small
- if unsure, backend should decide
