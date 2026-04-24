package com.sunagatov.memora.backend.capture.store

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "delivered_notifications")
data class MongoDeliveredNotificationDocument(
    @Id val notificationId: String
)
