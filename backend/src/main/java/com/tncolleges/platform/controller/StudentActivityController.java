package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.Student;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.StudentActivityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activity")
public class StudentActivityController {
    private final StudentActivityService activityService;
    private final CollegeAccessService collegeAccessService;
    private final CollegeRepository collegeRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public StudentActivityController(StudentActivityService activityService, CollegeAccessService collegeAccessService,
                                     CollegeRepository collegeRepository, UserRepository userRepository,
                                     StudentRepository studentRepository) {
        this.activityService = activityService;
        this.collegeAccessService = collegeAccessService;
        this.collegeRepository = collegeRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/track")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> trackActivity(@RequestBody Map<String, Object> payload,
                                           @AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Activity tracked securely",
                "activity", activityService.track(user.getUsername(), payload),
                "privacy_note", "Browsing activity is aggregated; it does not share student contact information with colleges."));
    }

    @GetMapping("/college/{collegeId}/aggregated")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getAggregatedInterest(@PathVariable Long collegeId,
                                                   @AuthenticationPrincipal UserDetails user) {
        if (user == null || collegeRepository.findById(collegeId).filter(c -> c.isRegistered() && c.isActive()).isEmpty()
                || !collegeAccessService.canManageCollege(user.getUsername(), collegeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied for this college's analytics"));
        }
        return ResponseEntity.ok(activityService.aggregate(collegeId));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT','PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getStudentActivities(@PathVariable Long studentId,
                                                  @AuthenticationPrincipal UserDetails principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Account not found"));
        boolean platformAdmin = user.getRole() == User.Role.PLATFORM_ADMIN || user.getRole() == User.Role.SUPER_ADMIN;
        Long targetUserId = studentId;
        if (!platformAdmin) {
            Student profile = studentRepository.findByUser_Id(user.getId()).orElse(null);
            if (!user.getId().equals(studentId) && (profile == null || !profile.getId().equals(studentId))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Students can only view their own activity"));
            }
            targetUserId = user.getId();
        } else {
            User targetUser = userRepository.findById(studentId).filter(candidate -> candidate.getRole() == User.Role.STUDENT).orElse(null);
            if (targetUser == null) {
                Student profile = studentRepository.findById(studentId).orElse(null);
                if (profile != null && profile.getUser() != null) targetUserId = profile.getUser().getId();
            }
        }
        List<Map<String, Object>> rows = activityService.byStudent(targetUserId);
        return ResponseEntity.ok(Map.of("student_id", targetUserId, "total_activities", rows.size(), "activities", rows));
    }
}
