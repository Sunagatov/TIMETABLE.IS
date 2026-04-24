package com.sunagatov.memora.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "memora")
data class MemoraProperties(
    val allowedOrigin: String,
    val appPasswordHash: String,
    val sessionDays: Long,
    val botIngestToken: String,
    val defaultCategoryPath: String,
    val ownerTelegramUserId: String,
    val transcriptionAutoRetryAttempts: Int,
    val aiAutoRetryAttempts: Int
)
