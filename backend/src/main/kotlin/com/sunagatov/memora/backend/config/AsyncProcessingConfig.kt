package com.sunagatov.memora.backend.config

import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AsyncProcessingConfig {

    @Bean(destroyMethod = "shutdown")
    fun memoraProcessingExecutor(): ExecutorService =
        Executors.newSingleThreadExecutor { runnable ->
            Thread(runnable, "memora-processing").apply {
                isDaemon = true
            }
        }
}
