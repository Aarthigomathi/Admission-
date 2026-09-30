package com.tncolleges.platform.controller;

import com.tncolleges.platform.dto.CollegeResponse;
import com.tncolleges.platform.dto.CourseResponse;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.CollegeBranding;
import com.tncolleges.platform.model.Course;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CourseRepository;
import com.tncolleges.platform.security.CollegeAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/** College CMS endpoints. Tenant ownership is checked against the authenticated account. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CollegeRepository collegeRepo;
    private final CourseRepository courseRepo;
    private final CollegeAccessService collegeAccessService;

    public AdminController(CollegeRepository collegeRepo,
                           CourseRepository courseRepo,
                           CollegeAccessService collegeAccessService) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
        this.collegeAccessService = collegeAccessService;
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && collegeAccessService.canManageCollege(user.getUsername(), collegeId);
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getCollegeForAdmin(@PathVariable Long collegeId,
                                                 @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only manage your own college"));
        }
        return collegeRepo.findById(collegeId)
                .map(CollegeResponse::from)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/college/{collegeId}/branding")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN')")
    public ResponseEntity<?> updateBranding(@PathVariable Long collegeId,
                                             @RequestBody CollegeBranding branding,
                                             @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You cannot edit another college's branding"));
        }
        if (collegeRepo.findById(collegeId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Persistence for branding is part of the CMS implementation phase.
        return ResponseEntity.ok(Map.of("message", "Branding update accepted", "collegeId", collegeId));
    }

    @PostMapping("/college/{collegeId}/courses")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> addCourse(@PathVariable Long collegeId,
                                        @RequestBody Course course,
                                        @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You cannot add a course to another college"));
        }
        Optional<College> college = collegeRepo.findById(collegeId);
        if (college.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        course.setCollege(college.get());
        Course saved = courseRepo.save(course);
        return ResponseEntity.ok(CourseResponse.from(saved));
    }

    @GetMapping("/analytics/{collegeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN')")
    public ResponseEntity<?> getAnalytics(@PathVariable Long collegeId,
                                           @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Analytics access denied for this college"));
        }
        if (collegeRepo.findById(collegeId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Placeholder response until analytics is backed by persisted activity records.
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("collegeId", collegeId);
        analytics.put("views", 0);
        analytics.put("courseViews", 0);
        analytics.put("enquiries", 0);
        analytics.put("pendingContent", 0);
        analytics.put("publishedSections", 0);
        analytics.put("profileCompletion", 0);
        analytics.put("dataStatus", "Analytics persistence is not implemented yet");
        return ResponseEntity.ok(analytics);
    }
}
