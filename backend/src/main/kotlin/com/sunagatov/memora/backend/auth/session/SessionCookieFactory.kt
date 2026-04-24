package com.sunagatov.memora.backend.auth.session

import com.sunagatov.memora.backend.config.MemoraProperties
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Component

@Component
class SessionCookieFactory(
    private val properties: MemoraProperties
) {
    private val cookieName = "memora_session"

    fun create(sessionId: String): ResponseCookie =
        ResponseCookie.from(cookieName, sessionId)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/")
            .maxAge(properties.sessionDays * 24 * 60 * 60)
            .build()

    fun clear(): ResponseCookie =
        ResponseCookie.from(cookieName, "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build()

    fun extractSessionId(request: HttpServletRequest): String? =
        request.cookies
            ?.firstOrNull { it.name == cookieName }
            ?.value
}
