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
import com.tncolleges.platform.service.CollegeAboutSectionService;
import com.tncolleges.platform.service.CollegeMediaService;
import com.tncolleges.platform.service.AicteIdeaLabService;
import com.tncolleges.platform.service.DepartmentPageService;
import com.tncolleges.platform.service.ResearchPageService;
import com.tncolleges.platform.service.IqacPageService;
import com.tncolleges.platform.service.CampusLifePageService;
import org.springframework.mock.web.MockMultipartFile;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.NotificationRepository;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.User;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
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
        "app.bootstrap.demo-student.password=test-student-password-123",
        "app.media.storage-dir=target/test-media"
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
    private CollegeAboutSectionService aboutSectionService;

    @Autowired
    private CollegeMediaService mediaService;

    @Autowired
    private DepartmentPageService departmentPageService;

    @Autowired
    private AicteIdeaLabService aicteIdeaLabService;

    @Autowired
    private ResearchPageService researchPageService;

    @Autowired
    private IqacPageService iqacPageService;

    @Autowired
    private CampusLifePageService campusLifePageService;

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
    void researchPageStoresResearchTablesCommitteeStatsAndFacilityDetailsWithPublicPagination() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Research CMS College " + suffix);
        signup.put("email", "research-cms-" + suffix + "@example.test");
        signup.put("loginUsername", "research-cms-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "Research CMS test");

        Map<String, Object> page = Map.of(
                "pageTitle", "Research",
                "policy", Map.of("title", "Research Policy", "description", "Institutional research policy.",
                        "backgroundImageUrl", "/api/media/81", "linkLabel", "Click here to View", "linkUrl", "https://example.test/research-policy.pdf"),
                "overview", Map.of("title", "Research Overview", "rows", List.of(
                        Map.of("serialNumber", 1, "description", "No of Ph.D. Faculty Members", "details", 96),
                        Map.of("serialNumber", 2, "description", "Approved guides by Anna University", "details", 31),
                        Map.of("serialNumber", 3, "description", "Number of Ph.D.s Produced", "details", "-", "breakdown", List.of(Map.of("period", "2018-2019", "details", 6))))),
                "researchCommittee", Map.of("title", "Research Committee (2021-22)", "academicYear", "2021-22", "rows", List.of(
                        Map.of("serialNumber", 1, "memberDetails", "Dr. P. Karthigaikumar (Principal)", "designation", "Chairman", "institution", "Karpagam College of Engineering, Coimbatore", "departmentCluster", "ECE"),
                        Map.of("serialNumber", 2, "memberDetails", "Dr. V. Senthilkumar", "designation", "Professor, Department of Production Engineering", "institution", "National Institute of Technology, Tiruchirappalli", "departmentCluster", "Mechanical and Civil"))),
                "publications", Map.of("title", "Publication details", "rows", List.of(
                        Map.of("calendarYear", "2022", "journalPublications", 256, "conferencePublications", 82, "bookChapterPublications", 24),
                        Map.of("calendarYear", "2023", "journalPublications", 206, "conferencePublications", 101, "bookChapterPublications", 65),
                        Map.of("calendarYear", "2024", "journalPublications", 209, "conferencePublications", 282, "bookChapterPublications", 27))),
                "seedMoney", Map.of("title", "Seed Money", "rows", List.of(Map.of("academicYear", "2024-25", "projectCount", 11, "amountInLakhs", 17.39))),
                "researchProjects", Map.of("title", "Research Projects", "rows", List.of(Map.of("academicYear", "2024-25", "projectCount", 18, "amountInLakhs", 93.67))),
                "researchFacilities", Map.of("title", "Centre of Excellence - Research facility available details", "clusters", List.of(
                        Map.of("code", "EEE", "title", "EEE", "facilities", List.of(Map.of("name", "BR Automation Lab", "imageUrl", "/api/media/82", "items", List.of("Power panel PP45 touch screen resistive display", "X20BR9300 – Bus receiver")))),
                        Map.of("code", "CSE", "title", "CSE", "imageUrl", "/api/media/83", "facilities", List.of(Map.of("name", "AI Research Lab", "items", List.of("GPU workstation", "Robotics platform")))))));

        Map<String, Object> draft = researchPageService.saveDraft(collegeId, page);
        assertEquals("DRAFT", draft.get("status"));
        org.junit.jupiter.api.Assertions.assertThrows(NoSuchElementException.class, () -> researchPageService.getPublic(slug));
        researchPageService.setPublished(collegeId, true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/public/colleges/" + slug + "/research-page"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.policy.title").value("Research Policy"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.researchCommittee.rows[1].departmentCluster").value("Mechanical and Civil"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.researchFacilities.clusters[0].facilities[0].items[1]").value("X20BR9300 – Bus receiver"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/public/colleges/" + slug + "/research-page/tables/publications?page=1&size=2"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.totalElements").value(3))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.totalPages").value(2))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.content[0].calendarYear").value("2024"));
    }

    @org.junit.jupiter.api.Test
    void iqacPageSupportsDraftPublicationResourcesAndPaginatedPublicMembers() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "IQAC CMS College " + suffix);
        signup.put("email", "iqac-cms-" + suffix + "@example.test");
        signup.put("loginUsername", "iqac-cms-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "IQAC CMS test");

        Map<String, Object> page = Map.of(
                "pageTitle", "IQAC",
                "about", Map.of("title", "About IQAC", "imageUrl", "/api/media/91", "paragraphs", List.of("The IQAC promotes quality initiatives.", "It coordinates institutional assessment.")),
                "functions", Map.of("title", "Functions of the IQAC", "items", List.of(Map.of("icon", "quality", "title", "Quality benchmarks", "description", "Develop and apply quality benchmarks."))),
                "members", Map.of("title", "IQAC Members", "rows", List.of(
                        Map.of("serialNumber", 1, "name", "Dr. A. Principal", "designation", "Chairperson"),
                        Map.of("serialNumber", 2, "name", "Dr. B. Coordinator", "designation", "IQAC Coordinator"))),
                "aqar", Map.of("title", "Annual Quality Assurance Report (AQAR)", "documents", List.of(Map.of("year", "2023-24", "title", "AQAR 2023-24", "url", "https://example.test/aqar-2024.pdf"))),
                "minutes", Map.of("title", "Minutes of the Meeting", "documents", List.of(Map.of("year", "2023-24", "title", "IQAC Minutes 2023-24", "url", "https://example.test/minutes-2024.pdf"))),
                "resources", List.of(Map.of("title", "Feedback Analysis", "description", "Feedback and action taken reports", "documents", List.of(Map.of("year", "2023-24", "title", "Feedback Analysis", "url", "https://example.test/feedback.pdf"))),
                        Map.of("title", "Institutional Distinctiveness", "documents", List.of(Map.of("year", "2023-24", "title", "Distinctiveness 2023-24", "url", "https://example.test/distinctiveness.pdf")))));

        Map<String, Object> draft = iqacPageService.saveDraft(collegeId, page);
        assertEquals("DRAFT", draft.get("status"));
        org.junit.jupiter.api.Assertions.assertThrows(NoSuchElementException.class, () -> iqacPageService.getPublic(slug));
        iqacPageService.setPublished(collegeId, true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/public/colleges/" + slug + "/iqac-page"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.about.paragraphs[0]").value("The IQAC promotes quality initiatives."))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.aqar.documents[0].year").value("2023-24"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/public/colleges/" + slug + "/iqac-page/members?page=1&size=1"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.totalElements").value(2))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.content[0].name").value("Dr. B. Coordinator"));

        Map<String, Object> storedDraft = contentService.asMap(contentService.getSection(collegeId, "iqacPage"));
        storedDraft.put("published", false);
        contentService.saveSection(collegeId, "iqacPage", storedDraft);
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/colleges/" + collegeId + "/content/iqacPage"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.published").doesNotExist());
    }

    @org.junit.jupiter.api.Test
    void campusLifeCmsPublishesCollegeScopedNavigationClubSectionsAndGallery() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Campus Life College " + suffix);
        signup.put("email", "campus-life-" + suffix + "@example.test");
        signup.put("loginUsername", "campus-life-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "Campus Life CMS test");

        Map<String, Object> campusPage = Map.of(
                "menuTitle", "Life @ Campus",
                "navigationItems", List.of(
                        Map.of("title", "Campus Clubs", "slug", "campus-clubs", "active", true, "displayOrder", 0),
                        Map.of("title", "Student Wellness", "slug", "student-wellness", "active", true, "displayOrder", 1)),
                "pages", List.of(Map.of(
                        "slug", "campus-clubs",
                        "title", "Campus Clubs",
                        "heroImageUrl", "https://example.test/campus-101.jpg",
                        "intro", Map.of("title", "Nurturing Creativity and Talent", "paragraphs", List.of("Campus clubs help students explore interests and develop skills.")),
                        "quoteBanner", Map.of("quote", "Bring your passion to life.", "imageUrl", "https://example.test/campus-102.jpg", "attribution", "Campus Community"),
                        "sections", List.of(
                                Map.of("type", "feature", "title", "Technical Clubs", "paragraphs", List.of("Hands-on sessions, competitions, and collaborative projects."), "imageUrl", "https://example.test/campus-103.jpg", "imagePosition", "right", "highlights", List.of("Workshops", "Project showcases")),
                                Map.of("type", "feature", "title", "Cultural Clubs", "paragraphs", List.of("Creative groups celebrate music, theatre, arts, and culture."), "imageUrl", "https://example.test/campus-104.jpg", "imagePosition", "left"),
                                Map.of("type", "clubList", "title", "Explore our clubs", "description", "Find a community that matches your interests.", "items", List.of(Map.of("title", "Robotics Club", "category", "Technical"), Map.of("title", "Music Society", "category", "Cultural"))),
                                Map.of("type", "gallery", "title", "Campus Gallery", "images", List.of(Map.of("url", "https://example.test/campus-105.jpg", "alt", "Students at a club event", "caption", "Club showcase"))),
                                Map.of("type", "celebrationList", "title", "Campus Celebrations", "items", List.of(Map.of("name", "Annual Cultural Day", "description", "A student-led celebration of music, dance, and community.", "dateLabel", "Annual", "category", "Cultural", "imageUrl", "https://example.test/campus-107.jpg", "displayOrder", 0))),
                                Map.of("type", "societyList", "title", "Professional Societies", "description", "Connect with discipline-focused professional communities.", "items", List.of(Map.of("name", "Engineering Society", "acronym", "ES", "description", "Student chapter for workshops and professional learning.", "department", "Engineering", "logoUrl", "https://example.test/campus-106.jpg", "websiteUrl", "https://example.test/society", "activities", List.of("Technical workshops", "Student conferences"), "coordinatorName", "Faculty Coordinator", "coordinatorDesignation", "Assistant Professor", "displayOrder", 0))),
                                Map.of("type", "eventShowcase", "title", "Annual Student Festival", "subtitle", "A campus-wide celebration", "description", "An annual programme bringing students together through learning, performances, and friendly competition.", "dateLabel", "Every February", "imageUrl", "https://example.test/campus-108.jpg", "imagePosition", "left", "stats", List.of(Map.of("value", "100+", "label", "Technical Events", "icon", "arrow"), Map.of("value", "50+", "label", "Workshops", "icon", "spark")))))));

        Map<String, Object> draft = campusLifePageService.saveDraft(collegeId, campusPage);
        assertEquals("DRAFT", draft.get("status"));
        org.junit.jupiter.api.Assertions.assertThrows(NoSuchElementException.class, () -> campusLifePageService.getPublic(slug));
        campusLifePageService.setPublished(collegeId, true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/public/colleges/" + slug + "/campus-life/pages/campus-clubs"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.menuTitle").value("Life @ Campus"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[2].items[0].title").value("Robotics Club"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[3].images[0].caption").value("Club showcase"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[4].items[0].name").value("Annual Cultural Day"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[4].items[0].dateLabel").value("Annual"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[5].items[0].name").value("Engineering Society"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[5].items[0].activities[1]").value("Student conferences"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[6].title").value("Annual Student Festival"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.sections[6].stats[0].value").value("100+"));

        Map<String, Object> stored = contentService.asMap(contentService.getSection(collegeId, "campusLifePage"));
        stored.put("published", false);
        contentService.saveSection(collegeId, "campusLifePage", stored);
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/colleges/" + collegeId + "/content/campusLifePage"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.published").doesNotExist());
    }

    @Test
    void aicteIdeaLabPageSupportsAboutVisionMissionObjectivesTeamAndEquipment() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "IDEA Lab College " + suffix);
        signup.put("email", "idea-lab-" + suffix + "@example.test");
        signup.put("loginUsername", "idea-lab-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "IDEA Lab test");

        Map<String, Object> ideaLabPage = Map.of(
                "pageTitle", "AICTE IDEA LAB",
                "aboutLab", Map.of("logoUrl", "/api/media/71", "paragraphs", List.of(
                        "AICTE IDEA Lab fosters creativity, problem-solving and hands-on learning.",
                        "The lab provides equipment, workshops, industry interaction and innovation challenges.")),
                "vision", "Establish a vibrant centre for innovation, experiential learning, research and entrepreneurship.",
                "missions", List.of(
                        Map.of("title", "Foster Innovation and Practical Application", "description", "Give students space to ideate, prototype and apply engineering knowledge."),
                        Map.of("title", "Strengthen Industry Collaboration", "description", "Build ties through mentoring, projects and internships.")),
                "objectives", List.of(
                        Map.of("title", "Experiential Learning & Innovation", "description", "Encourage hands-on learning through prototyping and hackathons."),
                        Map.of("title", "Industry Collaboration", "description", "Build industry-ready skills and multidisciplinary projects.")),
                "team", Map.of(
                        "chiefMentor", Map.of("name", "Dr. P. Karthigaikumar", "designation", "Principal / Professor", "department", "Electronics and Communication Engineering", "email", "principal@example.edu", "photoUrl", "/api/media/72"),
                        "facultyCoordinators", List.of(Map.of("name", "Dr. A. Saravanakumar", "designation", "Faculty Coordinator", "department", "Mechanical Engineering", "photoUrl", "/api/media/73")),
                        "techGurus", List.of(Map.of("name", "R. Haridass", "designation", "Assistant Professor", "department", "Mechanical Engineering", "photoUrl", "/api/media/74")),
                        "studentAmbassadors", List.of(Map.of("name", "B. Vinopaul Kirubhagaran", "designation", "Student Ambassador", "department", "Mechanical Engineering", "photoUrl", "/api/media/75"))),
                "infrastructure", Map.of("eyebrow", "Innovation Infrastructure", "title", "IDEA Lab Equipment",
                        "description", "Advanced machines and prototyping facilities for product development.",
                        "equipment", List.of(Map.of("name", "Dual 3D Printer", "imageUrl", "/api/media/76"),
                                Map.of("name", "3D Scanner", "imageUrl", "/api/media/77", "linkUrl", "https://example.edu/equipment"))));

        Map<String, Object> draft = aicteIdeaLabService.saveDraft(collegeId, ideaLabPage);
        assertEquals("DRAFT", draft.get("status"));
        org.junit.jupiter.api.Assertions.assertThrows(NoSuchElementException.class, () -> aicteIdeaLabService.getPublic(slug));
        aicteIdeaLabService.setPublished(collegeId, true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/public/colleges/" + slug + "/idea-lab"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.pageTitle").value("AICTE IDEA LAB"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.missions[1].title").value("Strengthen Industry Collaboration"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.objectives[0].title").value("Experiential Learning & Innovation"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.team.chiefMentor.name").value("Dr. P. Karthigaikumar"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.team.studentAmbassadors[0].name").value("B. Vinopaul Kirubhagaran"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.infrastructure.equipment[0].name").value("Dual 3D Printer"));
    }

    @Test
    void departmentCmsStoresAndPublishesTheFullDepartmentPage() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Department CMS College " + suffix);
        signup.put("email", "department-cms-" + suffix + "@example.test");
        signup.put("loginUsername", "department-cms-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "Department CMS test");

        Map<String, Object> department = contentService.addDepartment(collegeId, Map.of(
                "name", "Department of Civil Engineering", "code", "CE", "displayOrder", 0));
        String departmentId = String.valueOf(department.get("id"));
        Map<String, Object> page = new LinkedHashMap<>();
        page.put("hero", Map.of("title", "About the Department", "description", "Civil engineering department overview.", "imageUrl", "https://example.test/civil-hero.jpg"));
        page.put("overview", List.of("Infrastructure and laboratories.", "Industry engagement and student training."));
        page.put("mission", Map.of("title", "Our Mission", "items", List.of("Build technical skills.", "Prepare socially responsible engineers."), "imageUrl", "/api/media/61"));
        page.put("regulations", Map.of("backgroundImageUrl", "/api/media/62", "items", List.of(Map.of("year", "R2023", "title", "Curriculum and Regulations", "documentUrl", "/api/media/63"))));
        page.put("coursesOffered", List.of(Map.of("name", "B.E. Civil Engineering", "level", "UG", "duration", "4 years")));
        page.put("laboratories", List.of(Map.of("name", "Strength of Materials Laboratory", "icon", "building")));
        page.put("outcomes", Map.of("peos", List.of(Map.of("code", "PEO1", "description", "Solve civil engineering problems.")),
                "pos", List.of(Map.of("code", "PO1", "description", "Apply engineering knowledge.")),
                "psos", List.of(Map.of("code", "PSO1", "description", "Use civil design tools."))));
        page.put("hodProfile", Map.of("name", "Dr. R. Lakshmi", "designation", "Professor & Head", "biography", List.of("Experienced civil engineering educator."), "photoUrl", "/api/media/64"));
        page.put("faculty", Map.of("intro", "Distinguished faculty with industry and research experience.", "linkLabel", "View Faculty", "linkUrl", "https://example.test/faculty",
                "members", List.of(Map.of("name", "Dr. Civil Faculty", "designation", "Professor", "photoUrl", "/api/media/67", "qualification", "Ph.D."))));
        page.put("smartClassRooms", List.of(Map.of("title", "Mechanics of Solids II", "linkUrl", "https://example.test/classroom")));
        page.put("teachingAndLearning", List.of(Map.of("title", "Course Development Through YouTube and Blogs", "linkUrl", "https://example.test/learning")));
        page.put("curriculum", Map.of("backgroundImageUrl", "/api/media/65", "items", List.of(Map.of("year", "R2023", "documentUrl", "/api/media/66"))));

        Map<String, Object> draft = departmentPageService.saveDraft(collegeId, departmentId, page);
        assertEquals("DRAFT", draft.get("status"));
        assertTrue(contentService.publicDepartments(collegeId).isEmpty());
        assertTrue(contentService.publishedDepartmentPages(collegeId).isEmpty());

        departmentPageService.setPublished(collegeId, departmentId, true);
        assertEquals(1, contentService.publicDepartments(collegeId).size());
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/public/colleges/" + slug + "/departments/" + departmentId + "/page"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.department.name").value("Department of Civil Engineering"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.outcomes.peos[0].code").value("PEO1"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.laboratories[0].name").value("Strength of Materials Laboratory"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.hodProfile.name").value("Dr. R. Lakshmi"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.faculty.members[0].name").value("Dr. Civil Faculty"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.page.curriculum.items[0].year").value("R2023"));

        departmentPageService.setPublished(collegeId, departmentId, false);
        assertTrue(contentService.publicDepartments(collegeId).isEmpty());
    }

    @Test
    void accreditationPageSupportsBodiesDepartmentsMousAndElectivePartners() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Accreditation College " + suffix);
        signup.put("email", "accreditation-" + suffix + "@example.test");
        signup.put("loginUsername", "accreditation-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "Accreditation page test");

        Map<String, Object> data = Map.of(
                "accreditations", List.of(
                        Map.of("name", "NAAC (National Assessment And Accreditation Council)",
                                "grade", "A+", "logoUrl", "/api/media/41",
                                "description", "Accredited by NAAC with A+ Grade.",
                                "linkLabel", "For more Information", "linkUrl", "https://example.test/naac"),
                        Map.of("name", "NBA (National Board Of Accreditation)",
                                "logoUrl", "/api/media/42",
                                "description", "Accredited by NBA for the following departments:",
                                "departments", List.of("Information Technology", "Mechanical Engineering", "Electronics and Communication Engineering"))),
                "recognitionStatement", "The College is accredited by companies like Tata Consultancy Services and Wipro.",
                "partnershipsIntro", "We also have active MoUs & Centres of Excellence such as",
                "mousAndCenters", List.of(Map.of("name", "Infosys Campus Connect", "logoUrl", "/api/media/43"),
                        Map.of("name", "EMC Corporation - Academic Alliance Centre", "logoUrl", "/api/media/44")),
                "electivesHeading", "Electives",
                "electivesDescription", "35+ industry collaborated electives in association with",
                "electivePartners", List.of(Map.of("name", "Zoho", "logoUrl", "/api/media/45"),
                        Map.of("name", "Accenture", "logoUrl", "/api/media/46")));
        var section = aboutSectionService.create(collegeId, Map.of(
                "sectionKey", "ACCREDITATIONS", "title", "Accreditations",
                "type", "STRUCTURED", "data", data, "displayOrder", 5));
        assertFalse(section.published());
        aboutSectionService.setPublished(collegeId, section.id(), true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/colleges/" + slug + "/about-sections"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].sectionKey").value("ACCREDITATIONS"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.accreditations[1].departments[2]").value("Electronics and Communication Engineering"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.mousAndCenters[0].name").value("Infosys Campus Connect"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.electivePartners[1].name").value("Accenture"));
    }

    @Test
    void centersOfExcellenceSupportGroupedPartnerLogosAndFeaturedCenters() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Centers of Excellence College " + suffix);
        signup.put("email", "centers-" + suffix + "@example.test");
        signup.put("loginUsername", "centers-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "Centers of Excellence test");

        Map<String, Object> data = Map.of(
                "categories", List.of(
                        Map.of("title", "Circuit Engineering", "partners", List.of(
                                Map.of("name", "QNX", "logoUrl", "https://example.test/qnx.png"),
                                Map.of("name", "HCLTech", "logoUrl", "/api/media/31"),
                                Map.of("name", "NI LabVIEW", "logoUrl", "/api/media/32"))),
                        Map.of("title", "Computing Sciences", "partners", List.of(
                                Map.of("name", "Oracle Academy", "logoUrl", "/api/media/33")))),
                "featuredCenters", List.of(Map.of(
                        "title", "Karpagam Innovation and Skill Development Centre",
                        "description", List.of("Mentorship, funding guidance and incubation support.", "Startup workshops, boot camps and prototype development."),
                        "imageUrl", "/api/media/34", "linkLabel", "Know More", "linkUrl", "https://example.test/innovation")));
        var section = aboutSectionService.create(collegeId, Map.of(
                "sectionKey", "CENTER_OF_EXCELLENCE", "title", "Center of Excellence",
                "type", "STRUCTURED", "data", data, "displayOrder", 4));
        assertFalse(section.published());
        aboutSectionService.setPublished(collegeId, section.id(), true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/colleges/" + slug + "/about-sections"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].sectionKey").value("CENTER_OF_EXCELLENCE"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.categories[0].title").value("Circuit Engineering"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.categories[0].partners[2].name").value("NI LabVIEW"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.featuredCenters[0].title").value("Karpagam Innovation and Skill Development Centre"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.featuredCenters[0].linkLabel").value("Know More"));
    }

    @Test
    void managementProfilesSupportOrderedPeopleWithBiographiesAndImages() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "Management Profile College " + suffix);
        signup.put("email", "management-" + suffix + "@example.test");
        signup.put("loginUsername", "management-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "Management Profile test");

        Map<String, Object> data = Map.of("profiles", List.of(
                Map.of("designation", "CHAIRMAN", "name", "Dr. R. Vasanthakumar",
                        "biography", List.of("Founder promoter and Chairman.", "A philanthropist and education leader."),
                        "imageUrl", "https://example.test/chairman.jpg", "imagePosition", "LEFT"),
                Map.of("designation", "CHIEF EXECUTIVE OFFICER", "name", "Er. K. Murugaiah",
                        "biography", List.of("Joined the Trust as Administrative Officer.", "Leads institutional development."),
                        "imageUrl", "/api/media/23", "imagePosition", "RIGHT")));
        var section = aboutSectionService.create(collegeId, Map.of(
                "sectionKey", "MANAGEMENT_PROFILE", "title", "Management Profile",
                "type", "STRUCTURED", "data", data, "displayOrder", 3));
        assertFalse(section.published());
        assertEquals("Dr. R. Vasanthakumar", ((Map<?, ?>) ((List<?>) ((Map<?, ?>) section.data()).get("profiles")).get(0)).get("name"));
        aboutSectionService.setPublished(collegeId, section.id(), true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                        "/api/colleges/" + slug + "/about-sections"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].sectionKey").value("MANAGEMENT_PROFILE"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.profiles[0].designation").value("CHAIRMAN"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.profiles[1].imagePosition").value("RIGHT"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.profiles[0].biography[1]").value("A philanthropist and education leader."));
    }

    @Test
    void aboutProfileSectionsAreDraftByDefaultAndOnlyPublishedSectionsArePublic() {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Map<String, Object> signup = new LinkedHashMap<>();
        signup.put("name", "About CMS College " + suffix);
        signup.put("email", "about-" + suffix + "@example.test");
        signup.put("loginUsername", "about-admin-" + suffix);
        signup.put("loginPassword", "valid-password-123");
        Map<String, Object> college = collegeService.signup(signup);
        Long collegeId = ((Number) college.get("id")).longValue();
        String slug = String.valueOf(college.get("slug"));
        collegeService.verify(collegeId, "VERIFIED", "About CMS test");

        byte[] pngSignature = new byte[]{(byte) 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a};
        var uploadedImage = mediaService.upload(collegeId,
                new MockMultipartFile("file", "campus-photo.png", "image/png", pngSignature),
                "about-admin@example.test");
        assertEquals("/api/media/" + uploadedImage.id(), uploadedImage.url());
        try {
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(uploadedImage.url()))
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content().contentType("image/png"));
        } catch (Exception exception) {
            throw new AssertionError("Uploaded college images should be served for verified public colleges", exception);
        }

        Map<String, Object> sectionRequest = new LinkedHashMap<>();
        sectionRequest.put("sectionKey", "vision-mission");
        sectionRequest.put("title", "Vision and Mission");
        sectionRequest.put("type", "STRUCTURED");
        sectionRequest.put("data", Map.of(
                "vision", "To become a leading institution through innovation and research.",
                "mission", List.of("Develop knowledgeable professionals.", "Work with industry on relevant research."),
                "coreValues", List.of(Map.of("title", "Excellence & Innovation", "description", "Encourage creative solutions.", "icon", "award")),
                "visionTitle", "Our Vision",
                "missionTitle", "Our Mission",
                "coreValuesTitle", "Core Values"));
        sectionRequest.put("imageUrl", "https://example.test/campus.jpg");
        sectionRequest.put("displayOrder", 2);
        var draft = aboutSectionService.create(collegeId, sectionRequest);
        assertEquals("VISION_MISSION", draft.sectionKey());
        assertEquals("DRAFT", draft.status());
        assertFalse(draft.published());
        assertTrue(draft.data() instanceof Map<?, ?>);
        assertEquals("To become a leading institution through innovation and research.", ((Map<?, ?>) draft.data()).get("vision"));
        assertTrue(aboutSectionService.listPublishedBySlug(slug).isEmpty());

        aboutSectionService.setPublished(collegeId, draft.id(), true);
        try {
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                            "/api/colleges/" + slug + "/about-sections"))
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].sectionKey").value("VISION_MISSION"))
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].published").value(true))
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.vision").value("To become a leading institution through innovation and research."))
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.mission[0]").value("Develop knowledgeable professionals."))
                    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$[0].data.coreValues[0].title").value("Excellence & Innovation"));
        } catch (Exception exception) {
            throw new AssertionError("Published About sections should be available to public college pages", exception);
        }

        aboutSectionService.setPublished(collegeId, draft.id(), false);
        assertTrue(aboutSectionService.listPublishedBySlug(slug).isEmpty());
        org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class,
                () -> aboutSectionService.create(collegeId, Map.of("sectionKey", "UNSUPPORTED", "title", "Bad section", "content", "x")));
        mediaService.delete(collegeId, uploadedImage.id());
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
