package com.sunagatov.memora.backend.capture.store.mongo

import com.sunagatov.memora.backend.capture.store.FailureNotificationStore
import java.time.Instant
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora", name = ["storage"], havingValue = "mongo", matchIfMissing = true)
class MongoFailureNotificationStore(
    private val repository: MongoDeliveredFailureNotificationRepository
) : FailureNotificationStore {

    override fun isDelivered(notificationId: String): Boolean =
        repository.existsById(notificationId)

    override fun markDelivered(notificationId: String) {
        repository.save(
            MongoDeliveredFailureNotificationDocument(
                id = notificationId,
                deliveredAt = Instant.now()
            )
        )
    }
}
