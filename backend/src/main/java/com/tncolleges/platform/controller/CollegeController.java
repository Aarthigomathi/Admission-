package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.Course;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CourseRepository;
import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.CollegeContentService;
import com.tncolleges.platform.service.CollegeService;
import com.tncolleges.platform.service.DepartmentPageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {
    private final CollegeRepository collegeRepo;
    private final CourseRepository courseRepo;
    private final CollegeAccessService collegeAccessService;
    private final CollegeService collegeService;
    private final CollegeContentService contentService;
    private final DepartmentPageService departmentPageService;

    public CollegeController(CollegeRepository collegeRepo, CourseRepository courseRepo,
                             CollegeAccessService collegeAccessService, CollegeService collegeService,
                             CollegeContentService contentService, DepartmentPageService departmentPageService) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
        this.collegeAccessService = collegeAccessService;
        this.collegeService = collegeService;
        this.contentService = contentService;
        this.departmentPageService = departmentPageService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, Object> request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(collegeService.signup(request));
    }

    @GetMapping
    public List<Map<String, Object>> getPublicColleges(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        return collegeService.publicColleges(district, type, search);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getBySlug(@PathVariable String slug) {
        return collegeService.publicBySlug(slug).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{slug}/courses")
    public ResponseEntity<List<Map<String, Object>>> getCourses(@PathVariable String slug) {
        Optional<College> college = collegeRepo.findBySlug(slug).filter(c -> c.isRegistered() && c.isActive() && c.isVerified());
        if (college.isEmpty()) return ResponseEntity.notFound().build();
        List<Map<String, Object>> courses = new ArrayList<>();
        Set<String> seenIds = new HashSet<>();
        Object savedCourses = contentService.getSection(college.get().getId(), "courses");
        if (savedCourses instanceof List<?> list) {
            for (Object item : list) {
                Map<String, Object> course;
                if (item instanceof Map<?, ?>) course = contentService.asMap(item);
                else {
                    course = new LinkedHashMap<>();
                    course.put("value", item);
                }
                if (Boolean.FALSE.equals(course.get("active"))) continue;
                courses.add(course);
                if (course.get("id") != null) seenIds.add(String.valueOf(course.get("id")));
            }
        }
        for (Course course : courseRepo.findByCollegeIdAndActiveTrue(college.get().getId())) {
            if (seenIds.contains(String.valueOf(course.getId()))) continue;
            courses.add(courseMap(course));
        }
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id,
                                                       @AuthenticationPrincipal UserDetails user) {
        boolean admin = user != null && collegeAccessService.canManageCollege(user.getUsername(), id);
        return collegeService.byId(id, admin).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/my-college")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getMyCollege(@AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        return collegeAccessService.findManagedCollegeId(user.getUsername())
                .flatMap(id -> collegeService.byId(id, true))
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(403).body(Map.of("error", "No college is assigned to this account")));
    }

    @GetMapping("/{collegeId}/content")
    public ResponseEntity<?> getAllContent(@PathVariable Long collegeId, @AuthenticationPrincipal UserDetails user) {
        if (!canReadContent(collegeId, user)) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        Map<String, Object> all = contentService.getAll(collegeId);
        if (!canManage(collegeId, user)) {
            all.put("departments", contentService.publicDepartments(collegeId));
            all.put("deptPages", contentService.publishedDepartmentPages(collegeId));
            all.put("aicteIdeaLab", contentService.publishedAicteIdeaLab(collegeId));
            all.put("researchPage", contentService.publishedResearchPage(collegeId));
            all.put("iqacPage", contentService.publishedIqacPage(collegeId));
            all.put("campusLifePage", contentService.publishedCampusLifePage(collegeId));
        }
        return ResponseEntity.ok(all);
    }

    @GetMapping("/{collegeId}/content/{section}")
    public ResponseEntity<?> getContent(@PathVariable Long collegeId, @PathVariable String section,
                                        @AuthenticationPrincipal UserDetails user) {
        if (!contentService.supports(section)) return ResponseEntity.notFound().build();
        if (!canReadContent(collegeId, user)) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        if (!canManage(collegeId, user) && "departments".equals(section)) return ResponseEntity.ok(contentService.publicDepartments(collegeId));
        if (!canManage(collegeId, user) && "deptPages".equals(section)) return ResponseEntity.ok(contentService.publishedDepartmentPages(collegeId));
        if (!canManage(collegeId, user) && "aicteIdeaLab".equals(section)) return ResponseEntity.ok(contentService.publishedAicteIdeaLab(collegeId));
        if (!canManage(collegeId, user) && "researchPage".equals(section)) return ResponseEntity.ok(contentService.publishedResearchPage(collegeId));
        if (!canManage(collegeId, user) && "iqacPage".equals(section)) return ResponseEntity.ok(contentService.publishedIqacPage(collegeId));
        if (!canManage(collegeId, user) && "campusLifePage".equals(section)) return ResponseEntity.ok(contentService.publishedCampusLifePage(collegeId));
        return ResponseEntity.ok(contentService.getSection(collegeId, section));
    }

    @PutMapping("/{collegeId}/content/{section}")
    public ResponseEntity<?> putContent(@PathVariable Long collegeId, @PathVariable String section,
                                        @RequestBody Object data, @AuthenticationPrincipal UserDetails user) {
        if (!contentService.supports(section)) return ResponseEntity.badRequest().body(Map.of("error", "Unsupported content section"));
        if (!canManage(collegeId, user)) return ResponseEntity.status(403).body(Map.of("error", "You cannot edit this college"));
        if ("departments".equals(section) || "deptPages".equals(section)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Use the department CMS endpoints to manage departments and publish their pages"));
        }
        if ("aicteIdeaLab".equals(section)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Use the AICTE IDEA Lab CMS endpoints to validate and publish this page"));
        }
        if ("iqacPage".equals(section)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Use the IQAC page CMS endpoint to edit this section"));
        }
        if ("campusLifePage".equals(section)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Use the Campus Life CMS endpoint to edit this section"));
        }
        if ("researchPage".equals(section)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Use the Research CMS endpoints to validate and publish this page"));
        }
        return ResponseEntity.ok(contentService.saveSection(collegeId, section, data));
    }

    @GetMapping("/{collegeId}/departments")
    public ResponseEntity<?> getDepartments(@PathVariable Long collegeId, @AuthenticationPrincipal UserDetails user) {
        if (!canReadContent(collegeId, user)) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        return ResponseEntity.ok(canManage(collegeId, user)
                ? contentService.departments(collegeId) : contentService.publicDepartments(collegeId));
    }

    @PostMapping("/{collegeId}/departments")
    public ResponseEntity<?> createDepartment(@PathVariable Long collegeId, @RequestBody Map<String, Object> department,
                                              @AuthenticationPrincipal UserDetails user) {
        if (!canManage(collegeId, user)) return ResponseEntity.status(403).body(Map.of("error", "You cannot edit this college"));
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.addDepartment(collegeId, department));
    }

    @PutMapping("/{collegeId}/departments/{departmentId}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long collegeId, @PathVariable String departmentId,
                                              @RequestBody Map<String, Object> updates,
                                              @AuthenticationPrincipal UserDetails user) {
        if (!canManage(collegeId, user)) return ResponseEntity.status(403).body(Map.of("error", "You cannot edit this college"));
        return ResponseEntity.ok(contentService.updateDepartment(collegeId, departmentId, updates));
    }

    @DeleteMapping("/{collegeId}/departments/{departmentId}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long collegeId, @PathVariable String departmentId,
                                              @AuthenticationPrincipal UserDetails user) {
        if (!canManage(collegeId, user)) return ResponseEntity.status(403).body(Map.of("error", "You cannot edit this college"));
        contentService.deleteDepartment(collegeId, departmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{collegeId}/departments/{departmentId}/page")
    public ResponseEntity<?> getDepartmentPage(@PathVariable Long collegeId, @PathVariable String departmentId,
                                               @AuthenticationPrincipal UserDetails user) {
        if (!canReadContent(collegeId, user)) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        if (canManage(collegeId, user)) return ResponseEntity.ok(departmentPageService.getForAdmin(collegeId, departmentId));
        return ResponseEntity.ok(departmentPageService.publicPage(collegeId, departmentId));
    }

    @PutMapping("/{collegeId}/departments/{departmentId}/page")
    public ResponseEntity<?> putDepartmentPage(@PathVariable Long collegeId, @PathVariable String departmentId,
                                               @RequestBody Object page,
                                               @AuthenticationPrincipal UserDetails user) {
        if (!canManage(collegeId, user)) return ResponseEntity.status(403).body(Map.of("error", "You cannot edit this college"));
        return ResponseEntity.ok(departmentPageService.saveDraft(collegeId, departmentId, page));
    }

    @PatchMapping("/{collegeId}/departments/{departmentId}/page/publication")
    public ResponseEntity<?> publishDepartmentPage(@PathVariable Long collegeId, @PathVariable String departmentId,
                                                   @RequestBody Map<String, Object> request,
                                                   @AuthenticationPrincipal UserDetails user) {
        if (!canManage(collegeId, user)) return ResponseEntity.status(403).body(Map.of("error", "You cannot edit this college"));
        Object published = request.get("published");
        if (!(published instanceof Boolean value)) return ResponseEntity.badRequest().body(Map.of("error", "published must be true or false"));
        return ResponseEntity.ok(departmentPageService.setPublished(collegeId, departmentId, value));
    }

    private Map<String, Object> courseMap(Course course) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", course.getId());
        item.put("collegeId", course.getCollege() == null ? null : course.getCollege().getId());
        item.put("departmentId", course.getDepartment() == null ? null : course.getDepartment().getId());
        item.put("name", course.getName());
        item.put("degreeType", course.getDegreeType());
        item.put("level", course.getLevel());
        item.put("duration", course.getDuration());
        item.put("eligibility", course.getEligibility());
        item.put("minimumPercentage", course.getMinimumPercentage());
        item.put("admissionProcess", course.getAdmissionProcess());
        item.put("intake", course.getIntake());
        item.put("fees", course.getFees());
        item.put("description", course.getDescription());
        item.put("curriculum", course.getCurriculum());
        item.put("careerOpportunities", course.getCareerOpportunities());
        item.put("brochureUrl", course.getBrochureUrl());
        item.put("admissionLink", course.getAdmissionLink());
        item.put("contactInfo", course.getContactInfo());
        item.put("imageUrl", course.getImageUrl());
        item.put("active", course.isActive());
        item.put("featured", course.isFeatured());
        return item;
    }

    private boolean canReadContent(Long collegeId, UserDetails user) {
        if (user != null && collegeAccessService.canManageCollege(user.getUsername(), collegeId)) return true;
        return collegeRepo.findById(collegeId).filter(c -> c.isRegistered() && c.isActive() && c.isVerified()).isPresent();
    }

    private boolean canManage(Long collegeId, UserDetails user) {
        return user != null && collegeRepo.findById(collegeId).filter(College::isRegistered).isPresent()
                && collegeAccessService.canManageCollege(user.getUsername(), collegeId);
    }
}
