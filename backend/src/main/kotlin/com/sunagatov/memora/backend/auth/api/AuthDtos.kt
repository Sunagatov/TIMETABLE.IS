package com.sunagatov.memora.backend.auth.api

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:NotBlank
    val password: String
)

data class SessionStateResponse(
    val authenticated: Boolean
)
