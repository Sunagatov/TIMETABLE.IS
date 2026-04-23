package com.sunagatov.memora.backend.web

import com.sunagatov.memora.backend.config.MemoraProperties
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpSession
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

private const val AUTH_SESSION_KEY = "memora.authenticated"

data class LoginRequest(
    @field:NotBlank
    val password: String
)

data class SessionStateResponse(
    val authenticated: Boolean
)

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val properties: MemoraProperties
) {

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun login(
        @Valid @RequestBody request: LoginRequest,
        session: HttpSession
    ) {
        if (request.password != properties.appPassword) {
            throw UnauthorizedException("Invalid password.")
        }

        session.setAttribute(AUTH_SESSION_KEY, true)
        session.maxInactiveInterval = (properties.sessionDays * 24 * 60 * 60).toInt()
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun logout(request: HttpServletRequest) {
        request.getSession(false)?.invalidate()
    }

    @GetMapping("/session")
    fun sessionState(session: HttpSession?): SessionStateResponse =
        SessionStateResponse(authenticated = session?.getAttribute(AUTH_SESSION_KEY) == true)
}
