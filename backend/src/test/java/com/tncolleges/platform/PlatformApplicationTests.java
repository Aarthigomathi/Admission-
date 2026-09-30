package com.tncolleges.platform;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class PlatformApplicationTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void applicationContextLoads() {
        // Verifies the Spring configuration, repositories, security beans, and H2 setup start together.
    }

    @Test
    void researchTableIsCreatedInH2() {
        assertEquals(0, jdbcTemplate.queryForObject("select count(*) from research", Integer.class));
    }
}
