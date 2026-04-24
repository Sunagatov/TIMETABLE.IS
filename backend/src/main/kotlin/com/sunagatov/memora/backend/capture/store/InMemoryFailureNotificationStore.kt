package com.sunagatov.memora.backend.capture.store

import java.util.concurrent.ConcurrentHashMap
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora.storage", name = ["mode"], havingValue = "in-memory")
class InMemoryFailureNotificationStore : FailureNotificationStore {

    private val delivered = ConcurrentHashMap.newKeySet<String>()

    override fun isDelivered(notificationId: String): Boolean = delivered.contains(notificationId)

    override fun markDelivered(notificationId: String) {
        delivered.add(notificationId)
    }
}
