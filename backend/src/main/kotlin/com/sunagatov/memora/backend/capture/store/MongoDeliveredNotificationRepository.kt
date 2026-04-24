package com.sunagatov.memora.backend.capture.store

import org.springframework.data.mongodb.repository.MongoRepository

interface MongoDeliveredNotificationRepository : MongoRepository<MongoDeliveredNotificationDocument, String>
