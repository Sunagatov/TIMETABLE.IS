package com.sunagatov.memora.backend.auth.api

import com.sunagatov.memora.backend.auth.session.SessionCookieFactory
import com.sunagatov.memora.backend.auth.session.SessionService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val sessionService: SessionService,
    private val sessionCookieFactory: SessionCookieFactory
) {

    @PostMapping("/login")
    fun login(
        @Valid @RequestBody request: LoginRequest,
        response: HttpServletResponse
    ): ResponseEntity<Void> {
        val sessionId = sessionService.login(request.password)
        response.addHeader("Set-Cookie", sessionCookieFactory.create(sessionId).toString())
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/logout")
    fun logout(
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<Void> {
        sessionService.invalidate(sessionCookieFactory.extractSessionId(request))
        response.addHeader("Set-Cookie", sessionCookieFactory.clear().toString())
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/session")
    fun session(request: HttpServletRequest): SessionStateResponse =
        SessionStateResponse(
            authenticated = sessionService.isValid(sessionCookieFactory.extractSessionId(request))
        )
}
