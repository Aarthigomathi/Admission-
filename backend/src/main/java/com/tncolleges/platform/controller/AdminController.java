package com.tncolleges.platform.controller;

import com.tncolleges.platform.dto.CollegeResponse;
import com.tncolleges.platform.dto.CourseResponse;
import com.tncolleges.platform.model.College;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.Course;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CourseRepository;
import com.tncolleges.platform.repository.EnquiryRepository;
import com.tncolleges.platform.service.CollegeContentService;
import com.tncolleges.platform.service.CollegeService;
import com.tncolleges.platform.service.StudentActivityService;
import com.tncolleges.platform.security.CollegeAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** College CMS endpoints. Tenant ownership is checked against the authenticated account. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CollegeRepository collegeRepo;
    private final CourseRepository courseRepo;
    private final CollegeAccessService collegeAccessService;
    private final CollegeContentService contentService;
    private final CollegeService collegeService;
    private final StudentActivityService activityService;
    private final EnquiryRepository enquiryRepository;
    private final ObjectMapper objectMapper;

    public AdminController(CollegeRepository collegeRepo, CourseRepository courseRepo,
                           CollegeAccessService collegeAccessService, CollegeContentService contentService,
                           CollegeService collegeService, StudentActivityService activityService,
                           EnquiryRepository enquiryRepository, ObjectMapper objectMapper) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
        this.collegeAccessService = collegeAccessService;
        this.contentService = contentService;
        this.collegeService = collegeService;
        this.activityService = activityService;
        this.enquiryRepository = enquiryRepository;
        this.objectMapper = objectMapper;
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && collegeRepo.findById(collegeId).filter(College::isRegistered).isPresent()
                && collegeAccessService.canManageCollege(user.getUsername(), collegeId);
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getCollegeForAdmin(@PathVariable Long collegeId,
                                                 @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only manage your own college"));
        }
        return collegeService.byId(collegeId, true)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/college/{collegeId}/branding")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> updateBranding(@PathVariable Long collegeId,
                                             @RequestBody Map<String, Object> request,
                                             @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You cannot edit another college's branding"));
        }
        Map<String, Object> branding = new java.util.LinkedHashMap<>(request);
        if (request.containsKey("logoUrl")) branding.put("logo", request.get("logoUrl"));
        if (request.containsKey("heroImageUrl")) branding.put("heroImage", request.get("heroImageUrl"));
        if (request.containsKey("coverImageUrl")) branding.put("coverImage", request.get("coverImageUrl"));
        Map<String, Object> colors = new java.util.LinkedHashMap<>();
        if (request.get("colors") instanceof Map<?, ?> provided) {
            provided.forEach((key, value) -> colors.put(String.valueOf(key), value));
        }
        if (request.containsKey("primaryColor")) colors.put("primary", request.get("primaryColor"));
        if (request.containsKey("secondaryColor")) colors.put("secondary", request.get("secondaryColor"));
        if (request.containsKey("accentColor")) colors.put("accent", request.get("accentColor"));
        if (!colors.isEmpty()) branding.put("colors", colors);
        Object saved = contentService.saveSection(collegeId, "branding", branding);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/college/{collegeId}/courses")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getCollegeCourses(@PathVariable Long collegeId,
                                               @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return ResponseEntity.status(403).body(Map.of("error", "You cannot view another college's courses"));
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        java.util.Set<String> seenIds = new java.util.HashSet<>();
        Object saved = contentService.getSection(collegeId, "courses");
        if (saved instanceof java.util.List<?> list) {
            for (Object item : list) {
                if (!(item instanceof Map<?, ?>)) continue;
                Map<String, Object> course = contentService.asMap(item);
                result.add(course);
                if (course.get("id") != null) seenIds.add(String.valueOf(course.get("id")));
            }
        }
        for (Course course : courseRepo.findByCollegeId(collegeId)) {
            if (seenIds.contains(String.valueOf(course.getId()))) continue;
            result.add(objectMapper.convertValue(CourseResponse.from(course), new TypeReference<Map<String, Object>>() {}));
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/college/{collegeId}/courses")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> addCourse(@PathVariable Long collegeId,
                                        @RequestBody Course course,
                                        @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return ResponseEntity.status(403).body(Map.of("error", "You cannot add a course to another college"));
        College college = collegeRepo.findById(collegeId).orElse(null);
        if (college == null) return ResponseEntity.notFound().build();
        course.setId(null);
        course.setCollege(college);
        if (course.getName() == null || course.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Course name is required"));
        }
        if (course.getMinimumPercentage() != null && (course.getMinimumPercentage() < 0 || course.getMinimumPercentage() > 100)) {
            return ResponseEntity.badRequest().body(Map.of("error", "minimumPercentage must be between 0 and 100"));
        }
        Course saved = courseRepo.save(course);
        syncCourseContent(collegeId, saved);
        return ResponseEntity.status(201).body(CourseResponse.from(saved));
    }

    @PutMapping("/college/{collegeId}/courses/{courseId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> updateCourse(@PathVariable Long collegeId, @PathVariable Long courseId,
                                          @RequestBody Map<String, Object> updates,
                                          @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return ResponseEntity.status(403).body(Map.of("error", "You cannot edit another college's courses"));
        Course course = courseRepo.findById(courseId).filter(c -> c.getCollege() != null && collegeId.equals(c.getCollege().getId())).orElse(null);
        if (course == null) return ResponseEntity.notFound().build();
        applyCourseUpdates(course, updates);
        if (course.getName() == null || course.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Course name is required"));
        }
        Course saved = courseRepo.save(course);
        syncCourseContent(collegeId, saved);
        return ResponseEntity.ok(CourseResponse.from(saved));
    }

    @DeleteMapping("/college/{collegeId}/courses/{courseId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> deleteCourse(@PathVariable Long collegeId, @PathVariable Long courseId,
                                          @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return ResponseEntity.status(403).body(Map.of("error", "You cannot delete another college's courses"));
        Course course = courseRepo.findById(courseId).filter(c -> c.getCollege() != null && collegeId.equals(c.getCollege().getId())).orElse(null);
        if (course == null) return ResponseEntity.notFound().build();
        courseRepo.delete(course);
        Object value = contentService.getSection(collegeId, "courses");
        if (value instanceof java.util.List<?> list) {
            java.util.List<Map<String, Object>> updated = list.stream().filter(item -> item instanceof Map<?, ?>)
                    .map(contentService::asMap)
                    .filter(item -> !String.valueOf(item.get("id")).equals(String.valueOf(courseId))).toList();
            contentService.saveSection(collegeId, "courses", updated);
        }
        return ResponseEntity.noContent().build();
    }

    private void syncCourseContent(Long collegeId, Course course) {
        Object value = contentService.getSection(collegeId, "courses");
        java.util.List<Map<String, Object>> items = new java.util.ArrayList<>();
        if (value instanceof java.util.List<?> list) {
            for (Object item : list) if (item instanceof Map<?, ?>) items.add(contentService.asMap(item));
        }
        items.removeIf(item -> String.valueOf(item.get("id")).equals(String.valueOf(course.getId())));
        items.add(objectMapper.convertValue(CourseResponse.from(course), new TypeReference<Map<String, Object>>() {}));
        contentService.saveSection(collegeId, "courses", items);
    }

    private void applyCourseUpdates(Course course, Map<String, Object> updates) {
        setString(updates, "name", course::setName);
        setString(updates, "degreeType", course::setDegreeType);
        setString(updates, "level", course::setLevel);
        setString(updates, "duration", course::setDuration);
        setString(updates, "eligibility", course::setEligibility);
        if (updates.containsKey("minimumPercentage")) {
            course.setMinimumPercentage(decimal(updates.get("minimumPercentage"), "minimumPercentage"));
        }
        setString(updates, "admissionProcess", course::setAdmissionProcess);
        setString(updates, "fees", course::setFees);
        setString(updates, "description", course::setDescription);
        setString(updates, "curriculum", course::setCurriculum);
        setString(updates, "careerOpportunities", course::setCareerOpportunities);
        setString(updates, "brochureUrl", course::setBrochureUrl);
        setString(updates, "admissionLink", course::setAdmissionLink);
        setString(updates, "contactInfo", course::setContactInfo);
        setString(updates, "imageUrl", course::setImageUrl);
        if (updates.containsKey("intake")) course.setIntake(updates.get("intake") == null ? null : Integer.valueOf(String.valueOf(updates.get("intake"))));
        if (updates.containsKey("active")) course.setActive(Boolean.parseBoolean(String.valueOf(updates.get("active"))));
        if (updates.containsKey("featured")) course.setFeatured(Boolean.parseBoolean(String.valueOf(updates.get("featured"))));
    }

    private void setString(Map<String, Object> updates, String key, java.util.function.Consumer<String> setter) {
        if (updates.containsKey(key)) setter.accept(updates.get(key) == null ? null : String.valueOf(updates.get(key)));
    }

    private Double decimal(Object value, String fieldName) {
        if (value == null || String.valueOf(value).isBlank()) return null;
        try {
            double parsed = Double.parseDouble(String.valueOf(value).replace("%", "").trim());
            if (parsed < 0 || parsed > 100) throw new NumberFormatException();
            return parsed;
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException(fieldName + " must be between 0 and 100");
        }
    }

    private boolean isEmptyContent(Object value) {
        if (value == null) return true;
        if (value instanceof String text) return text.isBlank();
        if (value instanceof java.util.Collection<?> collection) return collection.isEmpty();
        if (value instanceof Map<?, ?> map) return map.isEmpty();
        return false;
    }

    private int profileCompletion(College college) {
        long filled = java.util.stream.Stream.of(college.getName(), college.getShortName(), college.getTagline(),
                        college.getDistrict(), college.getCity(), college.getAddress(), college.getPhone(),
                        college.getEmail(), college.getWebsite(), college.getAffiliation(), college.getPrincipalName())
                .filter(value -> value != null && !value.isBlank()).count();
        return (int) Math.round(filled * 100.0 / 11.0);
    }

    @GetMapping("/analytics/{collegeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN')")
    public ResponseEntity<?> getAnalytics(@PathVariable Long collegeId,
                                           @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Analytics access denied for this college"));
        }
        College college = collegeRepo.findById(collegeId).orElse(null);
        if (college == null) return ResponseEntity.notFound().build();
        Map<String, Object> analytics = new java.util.LinkedHashMap<>(activityService.aggregate(collegeId));
        long enquiryCount = enquiryRepository.countByCollege_Id(collegeId);
        analytics.put("collegeId", collegeId);
        analytics.put("views", analytics.getOrDefault("total_views", 0L));
        analytics.put("courseViews", analytics.getOrDefault("total_course_views", 0L));
        analytics.put("enquiries", enquiryCount);
        analytics.put("publishedSections", contentService.getAll(collegeId).entrySet().stream()
                .filter(entry -> !"updatedAt".equals(entry.getKey()) && !isEmptyContent(entry.getValue())).count());
        analytics.put("profileCompletion", profileCompletion(college));
        analytics.put("dataStatus", "Live persisted activity and college content");
        return ResponseEntity.ok(analytics);
    }
}
