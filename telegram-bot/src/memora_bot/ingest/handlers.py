from __future__ import annotations

import logging

import httpx
from telegram import Update
from telegram.ext import ContextTypes, MessageHandler, filters

from memora_bot.backend.client import BackendClient
from memora_bot.config import Settings

LOGGER = logging.getLogger(__name__)


def build_handlers(
    settings: Settings,
    backend_client: BackendClient,
) -> list[MessageHandler]:
    return [
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            _handle_text_message(settings, backend_client),
        ),
        MessageHandler(
            filters.VOICE,
            _handle_voice_message(settings, backend_client),
        ),
    ]


def _handle_text_message(settings: Settings, backend_client: BackendClient):
    async def handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        message = update.effective_message
        user = update.effective_user
        chat = update.effective_chat
        if message is None or user is None or chat is None or message.text is None:
            return
        if not _is_owner_message(settings, user.id):
            LOGGER.info("Ignoring text message from unauthorized Telegram user %s", user.id)
            return

        try:
            accepted_item = await backend_client.ingest_text_message(
                telegram_user_id=user.id,
                telegram_chat_id=chat.id,
                telegram_message_id=message.message_id,
                text=message.text,
            )
        except httpx.HTTPError:
            LOGGER.exception("Text message handoff to backend failed")
            await message.reply_text(_format_ingest_failure_message())
            return

        await message.reply_text(_format_ack_message(accepted_item.memora_id))

    return handler


def _handle_voice_message(settings: Settings, backend_client: BackendClient):
    async def handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        message = update.effective_message
        user = update.effective_user
        chat = update.effective_chat
        voice = message.voice if message is not None else None
        if message is None or user is None or chat is None or voice is None:
            return
        if not _is_owner_message(settings, user.id):
            LOGGER.info("Ignoring voice message from unauthorized Telegram user %s", user.id)
            return

        try:
            accepted_item = await backend_client.ingest_voice_message(
                telegram_user_id=user.id,
                telegram_chat_id=chat.id,
                telegram_message_id=message.message_id,
                telegram_file_id=voice.file_id,
                telegram_file_unique_id=voice.file_unique_id,
                duration_seconds=voice.duration,
                mime_type=voice.mime_type,
                file_size_bytes=voice.file_size,
            )
        except httpx.HTTPError:
            LOGGER.exception("Voice message handoff to backend failed")
            await message.reply_text(_format_ingest_failure_message())
            return

        await message.reply_text(_format_ack_message(accepted_item.memora_id))

    return handler


def _is_owner_message(settings: Settings, telegram_user_id: int) -> bool:
    return settings.owner_telegram_user_id > 0 and telegram_user_id == settings.owner_telegram_user_id


def _format_ack_message(memora_id: str) -> str:
    return f"Accepted. Processing asynchronously. Memora ID: {memora_id}"


def _format_ingest_failure_message() -> str:
    return "Memora could not accept this message right now. Please retry."
