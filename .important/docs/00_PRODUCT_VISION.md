# Product Vision

## Product name

Memora

## Product summary

Memora is a private, single-user system for capturing thoughts with minimal friction and then turning them into structured, reviewable records.

The primary entry point is a Telegram bot. The primary management interface is a web application.

## Core problem

The user often has many thoughts, ideas, reminders, and reflections in mind at once. Typing them manually into a notes app is annoying, slow, and energy-consuming. Raw notes also become an unstructured pile of text that is hard to review and use later.

Memora should help the user:

- get thoughts out of the head quickly
- capture them by voice or text in Telegram
- structure them automatically
- review AI output before trusting it
- retrieve approved items later through the web app

## Main pain statement

> Help the user get spoken or typed thoughts out of the head, structure them asynchronously, and find them later without creating another chaotic notes dump.

## Target user in V1

Only one user: the product owner.

## Success outcomes after one month of use

- fewer ideas lost
- easier retrieval
- cleaner thinking
- more ideas turned into projects or content
- less mental overload

## Product positioning

V1 is a private personal system first.  
It may become a reusable/public product later, but current requirements should optimize for the single-user case.

## Primary use pattern

- Capture in Telegram
- Process asynchronously
- Review in web app
- Approve only what should join the trusted knowledge base

## High-level product principles

- Telegram is the capture adapter, not the center of the system.
- The backend must be reusable by future clients (mobile, desktop, other bots).
- AI output is useful, but not fully trusted by default.
- Fresh AI-processed items must remain separate until the human reviews them.
