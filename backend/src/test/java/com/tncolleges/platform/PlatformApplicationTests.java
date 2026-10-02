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
import com.tncolleges.platform.service.EnquiryService;
import com.tncolleges.platform.service.StudentActivityService;
import com.tncolleges.platform.service.PlatformAnalyticsService;
import com.tncolleges.platform.service.StudentPortalService;
import com.tncolleges.platform.service.CollegeRecommendationService;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.NotificationRepository;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.User;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:tn_colleges_test;DB_CLOSE_DELAY=-1",
        "app.jwt.secret=dGVzdC1zZWNyZXQtZm9yLWp3dC1zaWduaW5nLW9ubHktMTIzNDU2Nzg5MA==",
        "app.bootstrap.platform-admin.email=superadmin@test.local",
        "app.bootstrap.platform-admin.password=test-admin-password-123",
        "app.bootstrap.demo-student.email=student@test.local",
        "app.bootstrap.demo-student.password=test-student-password-123"
})
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
    private CollegeRepository collegeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EnquiryService enquiryService;

    @Autowired
    private StudentActivityService activityService;

    @Autowired
    private PlatformAnalyticsService analyticsService;

    @Autowired
    private StudentPortalService studentPortalService;

    @Autowired
    private CollegeRecommendationService recommendationService;

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
    void unregisteredTemplateCollegesNeverAppearInListsOrAdminLookup() {
        String slug = "legacy-template-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        College template = collegeRepository.save(College.builder()
                .slug(slug)
                .name("Legacy Template College")
                .verified(true)
                .verificationStatus(College.VerificationStatus.VERIFIED)
                .registered(false)
                .build());

        assertFalse(collegeService.publicColleges(null, null, null).stream().anyMatch(c -> slug.equals(c.get("slug"))));
        assertFalse(collegeService.publicColleges(null, null, "Legacy Template College").stream().anyMatch(c -> slug.equals(c.get("slug"))));
        assertFalse(collegeService.allForPlatformAdmin().stream().anyMatch(c -> slug.equals(c.get("slug"))));
        assertTrue(collegeService.byId(template.getId(), true).isEmpty());
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
        Map<?, ?> branding = (Map<?, ?>) created.get("branding");
        assertEquals(Map.of("primary", "#1A3263", "secondary", "#547792", "accent", "#FAB95B"), branding.get("colors"));
        assertFalse(collegeService.publicColleges(null, null, null).stream().anyMatch(c -> slug.equals(c.get("slug"))));
        assertFalse(collegeService.publicColleges(null, null, "Test College " + suffix).stream().anyMatch(c -> slug.equals(c.get("slug"))));
        User testCollegeAdmin = userRepository.findByLoginIdentifier("college-admin-" + suffix).orElseThrow();
        assertTrue(notificationRepository.findByUserIdOrderByCreatedAtDesc(
                userRepository.findByEmail("superadmin@test.local").orElseThrow().getId()).stream()
                .anyMatch(notification -> collegeId.equals(notification.getCollegeId()) && "New college registration".equals(notification.getTitle())));

        Map<String, Object> department = contentService.addDepartment(collegeId, new LinkedHashMap<>(Map.of("name", "Computer Science")));
        String departmentId = String.valueOf(department.get("id"));
        contentService.saveSection(collegeId, "deptPages", Map.of(departmentId, Map.of("aboutText", List.of("Department page"))));
        contentService.deleteDepartment(collegeId, departmentId);
        assertTrue(contentService.departments(collegeId).isEmpty());
        assertFalse(contentService.asMap(contentService.getSection(collegeId, "deptPages")).containsKey(departmentId));

        collegeService.verify(collegeId, "VERIFIED", "approved for test");
        assertTrue(notificationRepository.findByUserIdOrderByCreatedAtDesc(testCollegeAdmin.getId()).stream()
                .anyMatch(notification -> collegeId.equals(notification.getCollegeId()) && "College verification update".equals(notification.getTitle())));
        assertTrue(collegeService.publicColleges(null, null, null).stream().anyMatch(c -> slug.equals(c.get("slug"))));
    }

    @Test
    void consentEnquiriesAndStudentActivityArePersistedWithoutExposingBrowsingPii() {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Activity Test College " + suffix);
        signup.put("email", "activity-" + suffix + "@example.test");
        signup.put("loginUsername", "activity-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        collegeService.verify(collegeId, "VERIFIED", "approved for activity test");
        Long realStudentId = userRepository.findByEmail("student@test.local").orElseThrow().getId();

        Map<String, Object> enquiryPayload = new LinkedHashMap<>();
        enquiryPayload.put("college_id", collegeId);
        enquiryPayload.put("question", "How do I apply?");
        enquiryPayload.put("consent", true);
        enquiryPayload.put("student_id", 999999L);
        Map<String, Object> enquiry = enquiryService.create("student@test.local", enquiryPayload);
        assertEquals(realStudentId, enquiry.get("student_id"));
        assertEquals(1, enquiryService.byCollege(collegeId).size());
        assertFalse(enquiryService.byCollege(collegeId).get(0).containsKey("student_id"));
        assertTrue(Boolean.TRUE.equals(enquiryService.byCollege(collegeId).get(0).get("personal_info_shared")));

        Map<String, Object> activityPayload = new LinkedHashMap<>();
        activityPayload.put("college_id", collegeId);
        activityPayload.put("activity_type", "COLLEGE_VIEW");
        activityPayload.put("student_id", 999999L);
        activityPayload.put("metadata", Map.of("page", "/college", "email", "should-not-be-stored@example.test",
                "context", Map.of("contactPhone", "9999999999", "section", "courses")));
        Map<String, Object> activity = activityService.track("student@test.local", activityPayload);
        assertEquals("COLLEGE_VIEW", activity.get("activity_type"));
        assertFalse(Boolean.TRUE.equals(activity.get("personal_info_shared")));
        assertFalse(String.valueOf(activity.get("metadata")).contains("should-not-be-stored@example.test"));
        assertFalse(String.valueOf(activity.get("metadata")).contains("9999999999"));
        Map<String, Object> aggregates = activityService.aggregate(collegeId);
        assertEquals(1L, aggregates.get("total_views"));
        assertEquals(1L, aggregates.get("total_enquiries"));
        Map<String, Object> visits = analyticsService.studentVisitAudit(collegeId, null, null, null, null, 0, 25);
        List<?> visitRows = (List<?>) visits.get("content");
        assertEquals(1, visitRows.size());
        Map<?, ?> visit = (Map<?, ?>) visitRows.get(0);
        assertEquals(realStudentId, visit.get("student_id"));
        assertEquals(collegeId, visit.get("college_id"));
        assertEquals("Test Student", visit.get("student_name"));
        assertEquals(1L, visit.get("college_views"));
        assertEquals(0L, visit.get("course_views"));
        assertTrue(visit.containsKey("last_visited_at"));

        enquiryPayload.put("consent", false);
        org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class,
                () -> enquiryService.create("student@test.local", enquiryPayload));
    }

    @Test
    void studentRecommendationsMatchMarksCourseAndPreferredDistrict() {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Recommendation College " + suffix);
        signup.put("email", "recommendation-" + suffix + "@example.test");
        signup.put("loginUsername", "recommendation-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        signup.put("district", "Coimbatore");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        collegeService.verify(collegeId, "VERIFIED", "recommendation test");
        contentService.saveSection(collegeId, "courses", List.of(
                Map.of("id", "eligible-" + suffix, "name", "B.E. Computer Science and Engineering", "minimumPercentage", 80.0, "active", true),
                Map.of("id", "below-cutoff-" + suffix, "name", "B.E. Computer Science and Engineering", "minimumPercentage", 95.0, "active", true)));

        studentPortalService.updateProfile("student@test.local", Map.of(
                "fullName", "Test Student", "mobile", "9876500000", "address", "12 Student Road",
                "district", "Coimbatore", "city", "Coimbatore"));
        assertEquals("12 Student Road", studentPortalService.profile("student@test.local").get("address"));
        studentPortalService.saveEducation("student@test.local", null,
                Map.of("level", "12th", "marks", "450/500", "interestedSubject", "Computer Science"));
        studentPortalService.savePreferences("student@test.local",
                Map.of("interestedCourse", "CSE", "preferredDistrict", "Coimbatore", "collegeType", "ANY"));

        Map<String, Object> result = recommendationService.recommend("student@test.local", null, null, null);
        List<?> recommendations = (List<?>) result.get("recommendations");
        Map<?, ?> match = recommendations.stream().map(Map.class::cast)
                .filter(item -> ((Map<?, ?>) item.get("college")).get("id").equals(collegeId))
                .findFirst().orElseThrow();
        assertEquals("ELIGIBLE", match.get("eligibilityStatus"));
        assertEquals(1, ((List<?>) match.get("matchingCourses")).size());
        assertEquals(1, result.get("excludedBelowMinimum"));
        assertEquals(90.0, ((Map<?, ?>) result.get("criteria")).get("percentage"));

        Map<String, Object> previewRequest = Map.of(
                "marks", "450/500", "percentage", "90", "educationLevel", "12th",
                "course", "CSE", "district", "Coimbatore", "type", "Any");
        try {
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/recommendations/preview")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(previewRequest)))
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.recommendations").isArray())
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.totalRecommendations").value(1));
        } catch (Exception exception) {
            throw new AssertionError("Public recommendation preview should match marks, course, and district", exception);
        }
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "PLATFORM_ADMIN")
    void platformAdminCanAccessThePlatformWideStudentVisitRegister() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/platform-admin/student-visits"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.content").isArray());
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "SUPER_ADMIN")
    void superAdminCanAccessThePlatformWideStudentVisitRegister() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/platform-admin/student-visits"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "COLLEGE_ADMIN")
    void collegeAccountsCannotAccessThePlatformWideStudentVisitRegister() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/platform-admin/student-visits"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isForbidden());
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
