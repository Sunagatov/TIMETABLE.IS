package com.sunagatov.memora.backend.web

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.filter.OncePerRequestFilter

private const val AUTH_SESSION_KEY = "memora.authenticated"

class SessionAuthFilter(
    private val botIngestToken: String
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        if (shouldAllow(request)) {
            filterChain.doFilter(request, response)
            return
        }

        val authenticated = request.getSession(false)?.getAttribute(AUTH_SESSION_KEY) == true
        if (!authenticated) {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            response.contentType = "application/json"
            response.writer.write("{\"message\":\"Unauthorized\"}")
            return
        }

        filterChain.doFilter(request, response)
    }

    private fun shouldAllow(request: HttpServletRequest): Boolean {
        val path = request.requestURI

        if (request.method == "OPTIONS") return true
        if (path == "/api/health") return true
        if (path == "/api/auth/login") return true

        if (path == "/api/internal/telegram/messages") {
            return request.getHeader("X-Bot-Ingest-Token") == botIngestToken
        }

        return false
    }
}
