from __future__ import annotations

import asyncio
import contextlib
import logging

from telegram.ext import Application

from memora_bot.backend.client import BackendClient, FailureNotification
from memora_bot.config import Settings
from memora_bot.ingest import build_handlers

LOGGER = logging.getLogger(__name__)
BACKEND_CLIENT_KEY = "backend_client"
FAILURE_POLL_TASK_KEY = "failure_poll_task"


def build_application(settings: Settings) -> Application:
    backend_client = BackendClient(settings)
    application = (
        Application.builder()
        .token(settings.bot_token)
        .post_init(_post_init)
        .post_shutdown(_post_shutdown)
        .build()
    )
    application.bot_data["settings"] = settings
    application.bot_data[BACKEND_CLIENT_KEY] = backend_client

    for handler in build_handlers(settings, backend_client):
        application.add_handler(handler)

    return application


async def _post_init(application: Application) -> None:
    settings: Settings = application.bot_data["settings"]
    backend_client = _get_backend_client(application)
    application.bot_data[FAILURE_POLL_TASK_KEY] = asyncio.create_task(
        _run_failure_notification_poll_loop(
            application=application,
            settings=settings,
            backend_client=backend_client,
        )
    )


async def _post_shutdown(application: Application) -> None:
    failure_poll_task = application.bot_data.get(FAILURE_POLL_TASK_KEY)
    if failure_poll_task is not None:
        failure_poll_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await failure_poll_task

    await _get_backend_client(application).close()


async def _run_failure_notification_poll_loop(
    *,
    application: Application,
    settings: Settings,
    backend_client: BackendClient,
) -> None:
    while True:
        try:
            notifications = await backend_client.fetch_failure_notifications()
            for notification in notifications:
                await _deliver_failure_notification(application, backend_client, notification)
        except Exception:
            LOGGER.exception("Failure notification poll failed")

        await asyncio.sleep(settings.failure_poll_interval_seconds)


async def _deliver_failure_notification(
    application: Application,
    backend_client: BackendClient,
    notification: FailureNotification,
) -> None:
    await application.bot.send_message(
        chat_id=notification.telegram_chat_id,
        text=_format_failure_message(notification),
    )
    await backend_client.acknowledge_failure_notification(notification.notification_id)


def _format_failure_message(notification: FailureNotification) -> str:
    lines = [
        "Processing failed.",
        f"Memora ID: {notification.memora_id}",
        f"Failed stage: {notification.failed_stage}",
        f"Summary: {notification.summary}",
    ]
    if notification.retry_context:
        lines.append(f"Retry context: {notification.retry_context}")
    return "\n".join(lines)


def _get_backend_client(application: Application) -> BackendClient:
    return application.bot_data[BACKEND_CLIENT_KEY]
