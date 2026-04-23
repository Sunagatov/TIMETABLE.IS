package com.sunagatov.memora.backend.auth.session

interface SessionStore {
    fun create(sessionId: String, expiresAtEpochSeconds: Long)
    fun exists(sessionId: String): Boolean
    fun delete(sessionId: String)
}
