package com.sunagatov.memora.backend.auth.session

import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "memora.storage", name = ["mode"], havingValue = "in-memory")
class InMemorySessionStore : SessionStore {

    private val sessions = ConcurrentHashMap<String, Long>()

    override fun create(sessionId: String, expiresAtEpochSeconds: Long) {
        sessions[sessionId] = expiresAtEpochSeconds
    }

    override fun exists(sessionId: String): Boolean {
        val expiresAt = sessions[sessionId] ?: return false
        val now = Instant.now().epochSecond
        if (expiresAt < now) {
            sessions.remove(sessionId)
            return false
        }
        return true
    }

    override fun delete(sessionId: String) {
        sessions.remove(sessionId)
    }
}
