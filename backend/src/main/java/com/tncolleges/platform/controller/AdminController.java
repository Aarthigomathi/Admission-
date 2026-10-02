package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Legacy college-admin endpoints. Tenant ownership is derived from the authenticated principal,
 * never from caller-supplied headers or college IDs alone.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CollegeRepository collegeRepo;
    private final CourseRepository courseRepo;
    private final UserRepository userRepo;

    public AdminController(CollegeRepository collegeRepo, CourseRepository courseRepo, UserRepository userRepo) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    private boolean isAuthorizedForCollege(Long requestedCollegeId, UserDetails principal) {
        if (principal == null) return false;
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return false;
        if (user.getRole() == User.Role.SUPER_ADMIN || user.getRole() == User.Role.PLATFORM_ADMIN) return true;
        return Objects.equals(requestedCollegeId, user.getCollegeId());
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getCollegeForAdmin(@PathVariable Long collegeId,
                                                 @AuthenticationPrincipal UserDetails principal) {
        if (!isAuthorizedForCollege(collegeId, principal)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only manage your own college."));
        }

        return collegeRepo.findById(collegeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/college/{collegeId}/branding")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN')")
    public ResponseEntity<?> updateBranding(@PathVariable Long collegeId,
                                            @RequestBody CollegeBranding branding,
                                            @AuthenticationPrincipal UserDetails principal) {
        if (!isAuthorizedForCollege(collegeId, principal)) {
            return ResponseEntity.status(403).body(Map.of("error", "You cannot edit another college's branding."));
        }

        Optional<College> collegeOpt = collegeRepo.findById(collegeId);
        if (collegeOpt.isEmpty()) return ResponseEntity.notFound().build();

        // In real app, save branding via service
        return ResponseEntity.ok(Map.of("message", "Branding updated for college " + collegeId, "collegeId", collegeId));
    }

    @PostMapping("/college/{collegeId}/courses")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> addCourse(@PathVariable Long collegeId,
                                       @RequestBody Course course,
                                       @AuthenticationPrincipal UserDetails principal) {
        if (!isAuthorizedForCollege(collegeId, principal)) {
            return ResponseEntity.status(403).body(Map.of("error", "You cannot add a course to another college."));
        }

        Optional<College> collegeOpt = collegeRepo.findById(collegeId);
        if (collegeOpt.isEmpty()) return ResponseEntity.notFound().build();

        course.setCollege(collegeOpt.get());
        Course saved = courseRepo.save(course);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/analytics/{collegeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN')")
    public ResponseEntity<?> getAnalytics(@PathVariable Long collegeId,
                                          @AuthenticationPrincipal UserDetails principal) {
        if (!isAuthorizedForCollege(collegeId, principal)) {
            return ResponseEntity.status(403).body(Map.of("error", "Analytics access denied for another college."));
        }

        // Mock analytics
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("collegeId", collegeId);
        analytics.put("views", 12400);
        analytics.put("courseViews", 3200);
        analytics.put("enquiries", 84);
        analytics.put("pendingContent", 3);
        analytics.put("publishedSections", 18);
        analytics.put("profileCompletion", 80);
        return ResponseEntity.ok(analytics);
    }
}
