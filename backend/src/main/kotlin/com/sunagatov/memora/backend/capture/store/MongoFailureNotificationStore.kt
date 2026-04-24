package com.sunagatov.memora.backend.capture.store

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

@Component
@Profile("mongo")
class MongoFailureNotificationStore(
    private val repository: MongoDeliveredNotificationRepository
) : FailureNotificationStore {

    override fun isDelivered(notificationId: String): Boolean =
        repository.existsById(notificationId)

    override fun markDelivered(notificationId: String) {
        repository.save(MongoDeliveredNotificationDocument(notificationId))
    }
}
