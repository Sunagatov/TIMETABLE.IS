package com.sunagatov.memora.backend.auth.session

import com.sunagatov.memora.backend.config.MemoraProperties
import java.time.Instant
import java.util.UUID
import org.springframework.stereotype.Service

@Service
class SessionService(
    private val store: SessionStore,
    private val properties: MemoraProperties
) {

    fun login(password: String): String {
        if (password != properties.appPassword) {
            throw IllegalArgumentException("Invalid password")
        }

        val sessionId = UUID.randomUUID().toString()
        val expiresAt = Instant.now().epochSecond + (properties.sessionDays * 24 * 60 * 60)
        store.create(sessionId, expiresAt)
        return sessionId
    }

    fun isValid(sessionId: String?): Boolean =
        sessionId != null && store.exists(sessionId)

    fun invalidate(sessionId: String?) {
        if (sessionId != null) {
            store.delete(sessionId)
        }
    }
}
