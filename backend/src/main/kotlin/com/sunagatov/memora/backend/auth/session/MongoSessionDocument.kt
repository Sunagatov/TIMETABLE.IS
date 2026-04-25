package com.sunagatov.memora.backend.auth.session

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("sessions")
data class MongoSessionDocument(
    @Id
    val sessionId: String,
    val expiresAtEpochSeconds: Long
)
