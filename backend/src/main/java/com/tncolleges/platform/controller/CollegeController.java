package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import com.tncolleges.platform.security.CollegeAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/colleges")
@CrossOrigin(origins = "*")
public class CollegeController {

    private final CollegeRepository collegeRepo;
    private final CourseRepository courseRepo;
    private final CollegeAccessService collegeAccessService;

    public CollegeController(CollegeRepository collegeRepo,
                             CourseRepository courseRepo,
                             CollegeAccessService collegeAccessService) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
        this.collegeAccessService = collegeAccessService;
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

    // This path sits under a public /api/colleges/** matcher, so method security is required.
    @GetMapping("/admin/my-college")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getMyCollege(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
        return collegeAccessService.findManagedCollegeId(user.getUsername())
                .flatMap(collegeRepo::findById)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(403).body(Map.of("error", "No college is assigned to this account")));
    }
}
