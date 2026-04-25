package com.sunagatov.memora.backend

import com.sunagatov.memora.backend.category.model.CategoryPath
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class CategoryPathTests {

    @Test
    fun `fromConfig accepts valid two level config`() {
        val path = CategoryPath.fromConfig("Default/General")

        assertEquals(CategoryPath("Default", "General"), path)
    }

    @Test
    fun `fromConfig tolerates legacy three level config by dropping leaf`() {
        val path = CategoryPath.fromConfig("Default/General/Inbox")

        assertEquals(CategoryPath("Default", "General"), path)
    }

    @Test
    fun `fromConfig rejects blank one level and arbitrary depth`() {
        assertFailsWith<IllegalArgumentException> { CategoryPath.fromConfig("") }
        assertFailsWith<IllegalArgumentException> { CategoryPath.fromConfig("Default") }
        assertFailsWith<IllegalArgumentException> { CategoryPath.fromConfig("A/B/C/D") }
    }
}
