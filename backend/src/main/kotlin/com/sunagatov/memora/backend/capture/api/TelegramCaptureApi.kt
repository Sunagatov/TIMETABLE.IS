package com.sunagatov.memora.backend.capture.api

const val TELEGRAM_CAPTURE_BASE_PATH = "/api/capture/telegram"
const val TELEGRAM_CAPTURE_INGEST_PATH = "$TELEGRAM_CAPTURE_BASE_PATH/ingest"
const val TELEGRAM_FAILURE_NOTIFICATIONS_PATH = "$TELEGRAM_CAPTURE_BASE_PATH/failure-notifications"
const val TELEGRAM_BOT_TOKEN_HEADER = "X-Memora-Bot-Token"
