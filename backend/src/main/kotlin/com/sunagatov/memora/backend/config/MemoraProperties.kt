package com.sunagatov.memora.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "memora")
data class MemoraProperties(
    val appPassword: String,
    val secretKey: String,
    val sessionDays: Long,
    val botIngestToken: String,
    val defaultCategoryPath: String,
    val allowedOrigin: String
)
