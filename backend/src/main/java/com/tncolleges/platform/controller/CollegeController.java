package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
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
    private final UserRepository userRepo;

    public CollegeController(CollegeRepository collegeRepo, CourseRepository courseRepo, UserRepository userRepo) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<College> getAllColleges(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search
    ) {
        if (search != null && !search.isBlank()) {
            return collegeRepo.searchByName(search);
        }
        if (district != null && !district.equals("All")) {
            return collegeRepo.findByDistrict(district);
        }
        if (type != null && !type.equals("All")) {
            return collegeRepo.findByTypeContainingIgnoreCase(type);
        }
        return collegeRepo.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<College> getBySlug(@PathVariable String slug) {
        return collegeRepo.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{slug}/courses")
    public ResponseEntity<List<Course>> getCourses(@PathVariable String slug) {
        Optional<College> college = collegeRepo.findBySlug(slug);
        if (college.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(courseRepo.findByCollegeIdAndActiveTrue(college.get().getId()));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<College> getById(@PathVariable Long id) {
        return collegeRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/my-college")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getMyCollege(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        if (user.getRole() == User.Role.PLATFORM_ADMIN || user.getRole() == User.Role.SUPER_ADMIN) {
            return ResponseEntity.badRequest().body(Map.of("error", "A platform administrator must select a college."));
        }
        if (user.getCollegeId() == null) return ResponseEntity.notFound().build();
        return collegeRepo.findById(user.getCollegeId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
