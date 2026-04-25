package com.sunagatov.memora.telegrambot.backend

const val BOT_TOKEN_HEADER = "X-Memora-Bot-Token"
const val DEFAULT_BACKEND_BASE_URL = "http://localhost:8080"
const val DEFAULT_BACKEND_INGEST_PATH = "/api/capture/telegram/ingest"
const val DEFAULT_BACKEND_FAILURE_NOTIFICATIONS_PATH = "/api/capture/telegram/failure-notifications"
const val DEFAULT_BACKEND_FAILURE_NOTIFICATION_ACK_PATH_TEMPLATE =
    "/api/capture/telegram/failure-notifications/%s/delivered"
