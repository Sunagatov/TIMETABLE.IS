package com.sunagatov.memora.backend.config

import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component

@Component
class ProductionConfigValidator(
    private val properties: MemoraProperties,
    private val environment: Environment
) : ApplicationRunner {

    override fun run(args: ApplicationArguments) {
        if (!shouldValidate()) {
            return
        }

        val errors = buildList {
            if (properties.botIngestToken.isBlank() || properties.botIngestToken == "change-me") {
                add("BACKEND_BOT_INGEST_TOKEN must be set to a non-placeholder value")
            }
            if (properties.appPasswordHash.isBlank() || properties.appPasswordHash == DEFAULT_APP_PASSWORD_HASH) {
                add("BACKEND_APP_PASSWORD_HASH must be set to a non-placeholder bcrypt hash")
            }
            if (properties.ownerTelegramUserId.isBlank()) {
                add("MEMORA_OWNER_TELEGRAM_USER_ID must be set")
            }
        }

        check(errors.isEmpty()) {
            "Unsafe production configuration: ${errors.joinToString("; ")}"
        }
    }

    private fun shouldValidate(): Boolean =
        properties.validateProductionConfig ||
            environment.activeProfiles.any { it == "prod" || it == "production" }

    private companion object {
        const val DEFAULT_APP_PASSWORD_HASH =
            "\$2y\$10\$xH.zhKTca6J1u513ef0STe7Y5Jc1ZuxVyNszPWV/lOMysTGwsukza"
    }
}
