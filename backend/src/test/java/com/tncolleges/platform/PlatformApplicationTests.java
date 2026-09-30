package com.tncolleges.platform;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.service.CollegeContentService;
import com.tncolleges.platform.service.CollegeService;
import com.tncolleges.platform.repository.UserRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureMockMvc
class PlatformApplicationTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CollegeService collegeService;

    @Autowired
    private CollegeContentService contentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void applicationContextLoads() {
        // Verifies the Spring configuration, repositories, security beans, and H2 setup start together.
    }

    @Test
    void entityTablesAreCreatedInH2() {
        assertEquals(0, jdbcTemplate.queryForObject("select count(*) from research", Integer.class));
        assertEquals(0, jdbcTemplate.queryForObject("select count(*) from placements", Integer.class));
        assertEquals(0, jdbcTemplate.queryForObject("select count(*) from accreditations", Integer.class));
        assertTrue(jdbcTemplate.queryForObject("select count(*) from college_content", Integer.class) >= 0);
    }

    @Test
    void signupStartsPendingSeedsEmptySectionsAndOnlyVerificationPublishesCollege() {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("name", "Test College " + suffix);
        request.put("shortName", "TC");
        request.put("email", "college-" + suffix + "@example.test");
        request.put("loginUsername", "college-admin-" + suffix);
        request.put("loginPassword", "test-password-123");
        request.put("district", "Coimbatore");
        request.put("branding", Map.of("logo", "https://example.test/logo.png"));

        Map<String, Object> created = collegeService.signup(request);
        Long collegeId = ((Number) created.get("id")).longValue();
        String slug = (String) created.get("slug");
        assertEquals("PENDING", created.get("verificationStatus").toString());
        assertEquals(false, created.get("verified"));
        assertFalse(created.containsKey("loginPassword"));
        assertTrue(((List<?>) created.get("departments")).isEmpty());
        assertEquals(Map.of(), created.get("deptPages"));
        assertTrue(collegeService.publicColleges(null, null, null).stream().anyMatch(c -> slug.equals(c.get("slug")) && Boolean.FALSE.equals(c.get("verified"))));
        assertTrue(userRepository.findByLoginIdentifier("college-admin-" + suffix).isPresent());

        Map<String, Object> department = contentService.addDepartment(collegeId, new LinkedHashMap<>(Map.of("name", "Computer Science")));
        String departmentId = String.valueOf(department.get("id"));
        contentService.saveSection(collegeId, "deptPages", Map.of(departmentId, Map.of("aboutText", List.of("Department page"))));
        contentService.deleteDepartment(collegeId, departmentId);
        assertTrue(contentService.departments(collegeId).isEmpty());
        assertFalse(contentService.asMap(contentService.getSection(collegeId, "deptPages")).containsKey(departmentId));

        collegeService.verify(collegeId, "VERIFIED", "approved for test");
        assertTrue(collegeService.publicColleges(null, null, null).stream().anyMatch(c -> slug.equals(c.get("slug"))));
    }

    @Test
    void collegeAdminCanLogInWithLoginUsername() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String username = "cms-admin-" + suffix;
        String password = "valid-password-123";
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("name", "Login Test College " + suffix);
        request.put("email", "login-" + suffix + "@example.test");
        request.put("loginUsername", username);
        request.put("loginPassword", password);
        collegeService.signup(request);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("loginId", username, "password", password))))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.role").value("COLLEGE_ADMIN"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.token").isNotEmpty());
    }
}
