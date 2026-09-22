package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/colleges")
@CrossOrigin(origins = "*")
public class CollegeController {

    private final CollegeRepository collegeRepo;
    private final CourseRepository courseRepo;

    public CollegeController(CollegeRepository collegeRepo, CourseRepository courseRepo) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
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

    // Multi-tenant security check: College Admin can only access own college
    @GetMapping("/admin/my-college")
    public ResponseEntity<?> getMyCollege(@RequestHeader(value = "X-College-Id", required = false) Long collegeId) {
        if (collegeId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "X-College-Id header required for multi-tenant isolation"));
        }
        return collegeRepo.findById(collegeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
