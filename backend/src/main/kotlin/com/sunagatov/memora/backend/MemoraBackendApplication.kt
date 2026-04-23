package com.sunagatov.memora.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MemoraBackendApplication

fun main(args: Array<String>) {
    runApplication<MemoraBackendApplication>(*args)
}
