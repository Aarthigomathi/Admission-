package com.tncolleges.platform.controller;

import com.tncolleges.platform.service.CollegeRecommendationService;
import com.tncolleges.platform.service.StudentPortalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/students/me")
@PreAuthorize("hasRole('STUDENT')")
public class StudentPortalController {
    private final StudentPortalService studentService;
    private final CollegeRecommendationService recommendationService;

    public StudentPortalController(StudentPortalService studentService,
                                   CollegeRecommendationService recommendationService) {
        this.studentService = studentService;
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<?> profile(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.profile(user.getUsername()));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails user,
                                           @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(studentService.updateProfile(user.getUsername(), updates));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> recommendations(@AuthenticationPrincipal UserDetails user,
                                              @RequestParam(required = false) String course,
                                              @RequestParam(required = false) String district,
                                              @RequestParam(required = false) String type) {
        return ResponseEntity.ok(recommendationService.recommend(user.getUsername(), course, district, type));
    }

    @GetMapping("/education")
    public ResponseEntity<?> education(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.education(user.getUsername()));
    }

    @PostMapping("/education")
    public ResponseEntity<?> addEducation(@AuthenticationPrincipal UserDetails user,
                                          @RequestBody Map<String, Object> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.saveEducation(user.getUsername(), null, body));
    }

    @PutMapping("/education/{educationId}")
    public ResponseEntity<?> updateEducation(@AuthenticationPrincipal UserDetails user,
                                             @PathVariable Long educationId,
                                             @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(studentService.saveEducation(user.getUsername(), educationId, body));
    }

    @DeleteMapping("/education/{educationId}")
    public ResponseEntity<?> deleteEducation(@AuthenticationPrincipal UserDetails user, @PathVariable Long educationId) {
        studentService.deleteEducation(user.getUsername(), educationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/preferences")
    public ResponseEntity<?> preferences(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.getPreferences(user.getUsername()));
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(@AuthenticationPrincipal UserDetails user,
                                               @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(studentService.savePreferences(user.getUsername(), body));
    }

    @GetMapping("/saved-colleges")
    public ResponseEntity<?> savedColleges(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.savedColleges(user.getUsername()));
    }

    @PostMapping("/saved-colleges/{collegeId}")
    public ResponseEntity<?> saveCollege(@AuthenticationPrincipal UserDetails user, @PathVariable Long collegeId) {
        studentService.saveCollege(user.getUsername(), collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("collegeId", collegeId, "saved", true));
    }

    @DeleteMapping("/saved-colleges/{collegeId}")
    public ResponseEntity<?> unsaveCollege(@AuthenticationPrincipal UserDetails user, @PathVariable Long collegeId) {
        studentService.unsaveCollege(user.getUsername(), collegeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/comparisons")
    public ResponseEntity<?> comparisons(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.comparisons(user.getUsername()));
    }

    @PostMapping("/comparisons/{collegeId}")
    public ResponseEntity<?> addComparison(@AuthenticationPrincipal UserDetails user, @PathVariable Long collegeId) {
        studentService.compareCollege(user.getUsername(), collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("collegeId", collegeId, "compared", true));
    }

    @DeleteMapping("/comparisons/{collegeId}")
    public ResponseEntity<?> removeComparison(@AuthenticationPrincipal UserDetails user, @PathVariable Long collegeId) {
        studentService.removeComparison(user.getUsername(), collegeId);
        return ResponseEntity.noContent().build();
    }
}
