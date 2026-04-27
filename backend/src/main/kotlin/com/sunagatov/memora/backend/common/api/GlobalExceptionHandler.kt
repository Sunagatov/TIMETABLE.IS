package com.sunagatov.memora.backend.common.api

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.BindException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

@RestControllerAdvice
class GlobalExceptionHandler {

    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(IllegalArgumentException::class)
    @Suppress("unused")
    fun handleIllegalArgument(exception: IllegalArgumentException): ResponseEntity<ApiErrorResponse> =
        badRequest(exception.message ?: "Bad request")

    @ExceptionHandler(HttpMessageNotReadableException::class)
    @Suppress("unused")
    fun handleUnreadableMessage(exception: HttpMessageNotReadableException): ResponseEntity<ApiErrorResponse> =
        badRequest(exception.deepestMessage() ?: "Malformed request body")

    @ExceptionHandler(IllegalStateException::class)
    @Suppress("unused")
    fun handleIllegalState(exception: IllegalStateException): ResponseEntity<ApiErrorResponse> =
        ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ApiErrorResponse(message = exception.message ?: "Conflict"))

    @ExceptionHandler(MethodArgumentNotValidException::class)
    @Suppress("unused")
    fun handleValidation(exception: MethodArgumentNotValidException): ResponseEntity<ApiErrorResponse> {
        val message = exception.bindingResult.fieldErrors.firstOrNull()?.defaultMessage
            ?: exception.bindingResult.globalErrors.firstOrNull()?.defaultMessage
            ?: "Validation failed"

        return badRequest(message)
    }

    @ExceptionHandler(BindException::class)
    @Suppress("unused")
    fun handleBind(exception: BindException): ResponseEntity<ApiErrorResponse> {
        val message = exception.bindingResult.fieldErrors.firstOrNull()?.defaultMessage
            ?: exception.bindingResult.globalErrors.firstOrNull()?.defaultMessage
            ?: exception.deepestMessage()
            ?: "Invalid request parameters"

        return badRequest(message)
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    @Suppress("unused")
    fun handleTypeMismatch(exception: MethodArgumentTypeMismatchException): ResponseEntity<ApiErrorResponse> {
        val parameterName = exception.name.takeIf { it.isNotBlank() } ?: "parameter"
        val value = exception.value?.toString()?.takeIf { it.isNotBlank() } ?: "provided value"

        return badRequest("Invalid value '$value' for request parameter '$parameterName'")
    }

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(exception: Exception): ResponseEntity<ApiErrorResponse> {
        logger.error("Unexpected backend error", exception)

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiErrorResponse(message = "Unexpected backend error"))
    }

    private fun badRequest(message: String): ResponseEntity<ApiErrorResponse> =
        ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiErrorResponse(message = message))

    private fun Throwable.deepestMessage(): String? {
        var current: Throwable = this
        while (current.cause != null && current.cause !== current) {
            current = current.cause!!
        }
        return current.message?.takeIf { it.isNotBlank() }
    }
}
