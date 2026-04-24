package com.sunagatov.memora.backend.capture.store.mongo

import org.springframework.data.mongodb.repository.MongoRepository

interface MongoDeliveredFailureNotificationRepository :
    MongoRepository<MongoDeliveredFailureNotificationDocument, String>
