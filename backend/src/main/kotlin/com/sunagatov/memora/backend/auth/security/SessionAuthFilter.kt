package com.sunagatov.memora.backend.auth.security

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.sunagatov.memora.backend.auth.session.SessionCookieFactory
import com.sunagatov.memora.backend.auth.session.SessionService
import com.sunagatov.memora.backend.common.api.ApiErrorResponse
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class SessionAuthFilter(
    private val sessionService: SessionService,
    private val sessionCookieFactory: SessionCookieFactory
) : OncePerRequestFilter() {

    private val mapper = jacksonObjectMapper()

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val path = request.requestURI
        return !path.startsWith("/api/")
            || path.startsWith("/api/health")
            || path.startsWith("/api/auth/")
            || path.startsWith("/api/capture/telegram/")
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val sessionId = sessionCookieFactory.extractSessionId(request)

        if (!sessionService.isValid(sessionId)) {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            response.contentType = "application/json"
            response.writer.write(mapper.writeValueAsString(ApiErrorResponse("Unauthorized")))
            return
        }

        filterChain.doFilter(request, response)
    }
}
