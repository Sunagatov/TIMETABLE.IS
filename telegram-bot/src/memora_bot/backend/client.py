from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import httpx

from memora_bot.config import Settings


@dataclass(frozen=True)
class AcceptedItem:
    memora_id: str


@dataclass(frozen=True)
class FailureNotification:
    notification_id: str
    telegram_chat_id: int
    memora_id: str
    failed_stage: str
    summary: str
    retry_context: str | None


class BackendClient:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = httpx.AsyncClient(
            base_url=settings.backend_base_url.rstrip("/"),
            timeout=settings.backend_timeout_seconds,
            headers={"X-Memora-Bot-Token": settings.backend_bot_ingest_token},
        )

    async def close(self) -> None:
        await self._client.aclose()

    async def ingest_text_message(
        self,
        *,
        telegram_user_id: int,
        telegram_chat_id: int,
        telegram_message_id: int,
        text: str,
    ) -> AcceptedItem:
        response = await self._client.post(
            self._settings.text_capture_path,
            json={
                "telegramUserId": telegram_user_id,
                "telegramChatId": telegram_chat_id,
                "telegramMessageId": telegram_message_id,
                "text": text,
            },
        )
        response.raise_for_status()
        payload = response.json()
        return AcceptedItem(memora_id=str(payload["memoraId"]))

    async def ingest_voice_message(
        self,
        *,
        telegram_user_id: int,
        telegram_chat_id: int,
        telegram_message_id: int,
        telegram_file_id: str,
        telegram_file_unique_id: str,
        duration_seconds: int | None,
        mime_type: str | None,
        file_size_bytes: int | None,
    ) -> AcceptedItem:
        response = await self._client.post(
            self._settings.voice_capture_path,
            json={
                "telegramUserId": telegram_user_id,
                "telegramChatId": telegram_chat_id,
                "telegramMessageId": telegram_message_id,
                "telegramFileId": telegram_file_id,
                "telegramFileUniqueId": telegram_file_unique_id,
                "durationSeconds": duration_seconds,
                "mimeType": mime_type,
                "fileSizeBytes": file_size_bytes,
            },
        )
        response.raise_for_status()
        payload = response.json()
        return AcceptedItem(memora_id=str(payload["memoraId"]))

    async def fetch_failure_notifications(self) -> list[FailureNotification]:
        response = await self._client.get(self._settings.failure_notifications_path)
        response.raise_for_status()
        payload = response.json()
        notifications = payload if isinstance(payload, list) else payload.get("notifications", [])
        return [self._parse_failure_notification(notification) for notification in notifications]

    async def acknowledge_failure_notification(self, notification_id: str) -> None:
        path = self._settings.failure_notification_ack_path_template.format(
            notification_id=notification_id
        )
        response = await self._client.post(path)
        response.raise_for_status()

    def _parse_failure_notification(self, payload: dict[str, Any]) -> FailureNotification:
        retry_context = payload.get("retryContext")
        if retry_context is not None:
            retry_context = str(retry_context).strip() or None

        return FailureNotification(
            notification_id=str(payload["notificationId"]),
            telegram_chat_id=int(payload["telegramChatId"]),
            memora_id=str(payload["memoraId"]),
            failed_stage=str(payload["failedStage"]),
            summary=str(payload["summary"]),
            retry_context=retry_context,
        )
