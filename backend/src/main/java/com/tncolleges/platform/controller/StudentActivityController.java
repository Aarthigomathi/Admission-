package com.tncolleges.platform.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.StudentActivity;
import com.tncolleges.platform.model.Student;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.StudentActivityRepository;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/activity")
public class StudentActivityController {
    private final StudentActivityRepository activityRepo;
    private final StudentRepository studentRepo;
    private final UserRepository userRepo;
    private final ObjectMapper objectMapper;

    public StudentActivityController(StudentActivityRepository activityRepo, StudentRepository studentRepo,
                                     UserRepository userRepo, ObjectMapper objectMapper) {
        this.activityRepo = activityRepo;
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/track")
    public ResponseEntity<?> trackActivity(@RequestBody Map<String, Object> payload,
                                           @AuthenticationPrincipal UserDetails principal) {
        Long studentId = 1L; // anonymous visitor bucket; never trust a caller-supplied identity
        if (principal != null) {
            User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
            if (user == null || user.getRole() != User.Role.STUDENT) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only student accounts can record authenticated activity"));
            }
            Student student = studentRepo.findByUserId(user.getId()).orElse(null);
            if (student == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Student profile not found"));
            studentId = student.getId();
        }
        Long collegeId = asLong(payload.get("college_id"));
        Long courseId = asLong(payload.get("course_id"));
        if (collegeId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "college_id is required"));
        }

        StudentActivity.ActivityType activityType;
        try {
            activityType = StudentActivity.ActivityType.valueOf(String.valueOf(payload.get("activity_type")).toUpperCase());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unsupported activity_type"));
        }
        boolean consent = Boolean.TRUE.equals(payload.get("consent"));
        boolean personalInfoShared = activityType == StudentActivity.ActivityType.ENQUIRY && consent;
        Object metadata = payload.get("metadata");
        String metadataJson;
        try {
            metadataJson = metadata == null ? null : objectMapper.writeValueAsString(metadata);
        } catch (JsonProcessingException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "metadata must be valid JSON"));
        }

        StudentActivity saved = activityRepo.save(StudentActivity.builder()
                .studentId(studentId == null ? 1L : studentId)
                .collegeId(collegeId)
                .courseId(courseId)
                .activityType(activityType)
                .date(LocalDate.now())
                .time(LocalTime.now())
                .personalInfoShared(personalInfoShared)
                .metadata(metadataJson)
                .build());

        Map<String, Object> result = new HashMap<>();
        result.put("id", saved.getId());
        result.put("student_id", saved.getStudentId());
        result.put("college_id", saved.getCollegeId());
        result.put("course_id", saved.getCourseId());
        result.put("activity_type", saved.getActivityType().name());
        result.put("date", saved.getDate().toString());
        result.put("time", saved.getTime().toString());
        result.put("personal_info_shared", saved.getPersonalInfoShared());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Activity recorded",
                "activity", result,
                "privacy_note", personalInfoShared
                        ? "Personal information is shared only for this consented enquiry."
                        : "Browsing activity is stored for aggregate analytics and does not share personal information with a college."
        ));
    }

    @GetMapping("/college/{collegeId}/aggregated")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','PLATFORM_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getAggregatedInterest(@PathVariable Long collegeId,
                                                   @AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        boolean platformAdmin = user.getRole() == User.Role.PLATFORM_ADMIN || user.getRole() == User.Role.SUPER_ADMIN;
        if (!platformAdmin && !collegeId.equals(user.getCollegeId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You can only view aggregated activity for your college"));
        }
        EnumMap<StudentActivity.ActivityType, Long> counts = new EnumMap<>(StudentActivity.ActivityType.class);
        for (StudentActivity.ActivityType type : StudentActivity.ActivityType.values()) {
            counts.put(type, activityRepo.countByCollegeIdAndActivityType(collegeId, type));
        }
        Map<String, Long> byType = new HashMap<>();
        counts.forEach((type, count) -> byType.put(type.name(), count));
        long views = counts.get(StudentActivity.ActivityType.COLLEGE_VIEW);
        long courseViews = counts.get(StudentActivity.ActivityType.COURSE_VIEW);
        long saves = counts.get(StudentActivity.ActivityType.SAVE);
        long compares = counts.get(StudentActivity.ActivityType.COMPARE);
        long enquiries = counts.get(StudentActivity.ActivityType.ENQUIRY);

        Map<String, Object> result = new HashMap<>();
        result.put("college_id", collegeId);
        result.put("total_students_viewed", activityRepo.countDistinctStudentsByCollegeIdAndActivityType(collegeId, StudentActivity.ActivityType.COLLEGE_VIEW));
        result.put("total_views", views);
        result.put("total_course_views", courseViews);
        result.put("total_saved", saves);
        result.put("total_compared", compares);
        result.put("total_enquiries", enquiries);
        result.put("by_activity_type", byType);
        result.put("privacy_note", "Aggregated activity only; individual browsing records are not exposed to colleges.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT','PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getStudentActivity(@PathVariable Long studentId,
                                                @AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        boolean platformAdmin = user.getRole() == User.Role.PLATFORM_ADMIN || user.getRole() == User.Role.SUPER_ADMIN;
        Student student = studentRepo.findByUserId(user.getId()).orElse(null);
        if (!platformAdmin && (student == null || !studentId.equals(student.getId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You can only view your own activity"));
        }
        return ResponseEntity.ok(activityRepo.findByStudentIdOrderByCreatedAtDesc(studentId).stream().map(activity -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", activity.getId());
            item.put("college_id", activity.getCollegeId());
            item.put("course_id", activity.getCourseId());
            item.put("activity_type", activity.getActivityType().name());
            item.put("date", activity.getDate().toString());
            item.put("time", activity.getTime().toString());
            item.put("personal_info_shared", activity.getPersonalInfoShared());
            item.put("metadata", activity.getMetadata());
            return item;
        }).toList());
    }

    private Long asLong(Object value) {
        try { return value == null ? null : Long.valueOf(String.valueOf(value)); }
        catch (NumberFormatException ex) { return null; }
    }
}
