package com.sunagatov.memora.backend.capture.store

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(
    prefix = "memora.storage",
    name = ["mode"],
    havingValue = "mongo",
    matchIfMissing = true
)
class MongoFailureNotificationStore(
    private val repository: MongoDeliveredNotificationRepository
) : FailureNotificationStore {

    override fun isDelivered(notificationId: String): Boolean =
        repository.existsById(notificationId)

    override fun markDelivered(notificationId: String) {
        repository.save(MongoDeliveredNotificationDocument(notificationId))
    }
}
