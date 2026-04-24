package com.sunagatov.memora.backend.capture.store

interface FailureNotificationStore {
    fun isDelivered(notificationId: String): Boolean
    fun markDelivered(notificationId: String)
}
