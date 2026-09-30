package com.tncolleges.platform.controller;

import com.tncolleges.platform.dto.CollegeResponse;
import com.tncolleges.platform.dto.CourseResponse;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CourseRepository;
import com.tncolleges.platform.security.CollegeAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public List<CollegeResponse> getAllColleges(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search
    ) {
        List<College> colleges;
        if (search != null && !search.isBlank()) {
            colleges = collegeRepo.searchByName(search);
        } else if (district != null && !district.equals("All")) {
            colleges = collegeRepo.findByDistrict(district);
        } else if (type != null && !type.equals("All")) {
            colleges = collegeRepo.findByTypeContainingIgnoreCase(type);
        } else {
            colleges = collegeRepo.findAll();
        }
        return colleges.stream().map(CollegeResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CollegeResponse> getBySlug(@PathVariable String slug) {
        return collegeRepo.findBySlug(slug)
                .map(CollegeResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{slug}/courses")
    public ResponseEntity<List<CourseResponse>> getCourses(@PathVariable String slug) {
        Optional<College> college = collegeRepo.findBySlug(slug);
        if (college.isEmpty()) return ResponseEntity.notFound().build();
        List<CourseResponse> courses = courseRepo.findByCollegeIdAndActiveTrue(college.get().getId())
                .stream()
                .map(CourseResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<CollegeResponse> getById(@PathVariable Long id) {
        return collegeRepo.findById(id)
                .map(CollegeResponse::from)
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
                .map(CollegeResponse::from)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(403).body(Map.of("error", "No college is assigned to this account")));
    }
}
