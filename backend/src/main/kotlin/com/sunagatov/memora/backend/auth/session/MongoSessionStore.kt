package com.sunagatov.memora.backend.auth.session

import java.time.Instant
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(
    prefix = "memora.storage",
    name = ["mode"],
    havingValue = "mongo",
    matchIfMissing = true
)
class MongoSessionStore(
    private val repository: MongoSessionRepository
) : SessionStore {

    override fun create(sessionId: String, expiresAtEpochSeconds: Long) {
        repository.save(
            MongoSessionDocument(
                sessionId = sessionId,
                expiresAtEpochSeconds = expiresAtEpochSeconds
            )
        )
    }

    override fun exists(sessionId: String): Boolean {
        val document = repository.findById(sessionId).orElse(null) ?: return false
        if (document.expiresAtEpochSeconds < Instant.now().epochSecond) {
            repository.deleteById(sessionId)
            return false
        }
        return true
    }

    override fun delete(sessionId: String) {
        repository.deleteById(sessionId)
    }
}
