package com.sunagatov.memora.backend.capture.store.mongo

import java.time.Instant
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("memora_delivered_failure_notifications")
data class MongoDeliveredFailureNotificationDocument(
    @Id
    val id: String,
    val deliveredAt: Instant
)
