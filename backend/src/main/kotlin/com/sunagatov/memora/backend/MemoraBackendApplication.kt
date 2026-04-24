package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.config.MemoraProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration

@SpringBootApplication(exclude = [UserDetailsServiceAutoConfiguration::class])
@EnableConfigurationProperties(MemoraProperties::class)
class MemoraBackendApplication

fun main(args: Array<String>) {
    runApplication<MemoraBackendApplication>(*args)
}
