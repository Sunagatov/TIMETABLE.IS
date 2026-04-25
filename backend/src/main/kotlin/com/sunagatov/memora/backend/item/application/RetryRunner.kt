package com.sunagatov.memora.backend.item.application

data class RetryOutcome<T>(
    val success: Boolean,
    val attempts: Int,
    val value: T? = null,
    val lastErrorMessage: String? = null
) {
    fun lastErrorMessageSuffix(): String =
        lastErrorMessage?.let { ": $it" } ?: ""
}

class RetryRunner {

    fun <T> run(maxAttempts: Int, block: () -> T): RetryOutcome<T> {
        require(maxAttempts >= 1) { "Retry attempts must be at least 1" }

        var lastErrorMessage: String? = null
        repeat(maxAttempts) { attempt ->
            try {
                return RetryOutcome(success = true, attempts = attempt + 1, value = block())
            } catch (exception: InterruptedException) {
                Thread.currentThread().interrupt()
                return RetryOutcome(
                    success = false,
                    attempts = attempt + 1,
                    lastErrorMessage = exception.message ?: exception.javaClass.simpleName
                )
            } catch (exception: Exception) {
                lastErrorMessage = exception.message ?: exception.javaClass.simpleName
            }
        }

        return RetryOutcome(
            success = false,
            attempts = maxAttempts,
            lastErrorMessage = lastErrorMessage
        )
    }
}
