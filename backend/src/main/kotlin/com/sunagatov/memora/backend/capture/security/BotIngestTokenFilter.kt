package com.sunagatov.memora.backend.capture.security

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.sunagatov.memora.backend.common.api.ApiErrorResponse
import com.sunagatov.memora.backend.config.MemoraProperties
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class BotIngestTokenFilter(
    private val properties: MemoraProperties
) : OncePerRequestFilter() {

    private val mapper = jacksonObjectMapper()

    override fun shouldNotFilter(request: HttpServletRequest): Boolean =
        !request.requestURI.startsWith("/api/capture/telegram/")

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = request.getHeader("X-Memora-Bot-Token")
        val configuredToken = properties.botIngestToken.takeIf { it.isNotBlank() }

        if (configuredToken == null) {
            response.status = HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            response.contentType = "application/json"
            response.writer.write(mapper.writeValueAsString(ApiErrorResponse("Bot ingest token is not configured")))
            return
        }

        if (token != configuredToken) {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            response.contentType = "application/json"
            response.writer.write(mapper.writeValueAsString(ApiErrorResponse("Invalid bot ingest token")))
            return
        }

        filterChain.doFilter(request, response)
    }
}
