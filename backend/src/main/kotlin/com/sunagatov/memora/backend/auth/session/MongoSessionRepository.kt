package com.sunagatov.memora.backend.auth.session

import org.springframework.data.mongodb.repository.MongoRepository

interface MongoSessionRepository : MongoRepository<MongoSessionDocument, String>
