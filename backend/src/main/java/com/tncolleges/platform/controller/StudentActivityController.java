package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.StudentActivity;
import com.tncolleges.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

/**
 * Student Activity Tracking - Critical Feature
 * Records: student_id, college_id, course_id, date, time, activity_type
 * Activity Types: COLLEGE_VIEW, COURSE_VIEW, SAVE, COMPARE, ENQUIRY
 * 
 * Privacy Rule: Viewing college does NOT auto-send personal info to college
 * Only ENQUIRE NOW with consent shares personal info
 * personalInfoShared flag = true only when activity_type=ENQUIRY and consent given
 * 
 * College analytics shows aggregated only: total students viewed, total views, saves, compares, enquiries
 * By education level, district, course, date, activity type - NO individual browsing exposed
 */
@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "*")
public class StudentActivityController {

    // In production, inject StudentActivityRepository
    // For now, mock responses showing structure

    @PostMapping("/track")
    public ResponseEntity<?> trackActivity(@RequestBody Map<String, Object> payload) {
        // Expected payload: student_id, college_id, course_id (optional), activity_type, metadata, consent
        Long studentId = Long.valueOf(payload.getOrDefault("student_id", 1).toString());
        Long collegeId = Long.valueOf(payload.get("college_id").toString());
        String activityType = payload.get("activity_type").toString();
        Boolean consent = (Boolean) payload.getOrDefault("consent", false);
        
        // Privacy rule enforcement
        boolean personalInfoShared = false;
        if ("ENQUIRY".equals(activityType) && Boolean.TRUE.equals(consent)) {
            personalInfoShared = true; // Only ENQUIRY with consent shares
        }
        // COLLEGE_VIEW, COURSE_VIEW, SAVE, COMPARE never share personal info

        Map<String, Object> activity = new HashMap<>();
        activity.put("id", System.currentTimeMillis());
        activity.put("student_id", studentId);
        activity.put("college_id", collegeId);
        activity.put("course_id", payload.get("course_id"));
        activity.put("date", LocalDate.now().toString());
        activity.put("time", LocalTime.now().toString());
        activity.put("activity_type", activityType);
        activity.put("personal_info_shared", personalInfoShared);
        activity.put("metadata", payload.get("metadata"));
        activity.put("created_at", new Date().toString());

        // In real app: studentActivityRepository.save(entity)

        return ResponseEntity.ok(Map.of(
            "message", "Activity tracked securely",
            "activity", activity,
            "privacy_note", personalInfoShared ? 
                "Personal info shared with consent for ENQUIRY" : 
                "Viewing does NOT auto-send personal info - aggregated only for college"
        ));
    }

    @GetMapping("/college/{collegeId}/aggregated")
    public ResponseEntity<?> getAggregatedInterest(@PathVariable Long collegeId) {
        // Platform Admin and College Admin (own college only) can see aggregated
        // Returns: totalStudentsViewed, totalViews, courseViews, saved, compared, enquiries
        // Plus breakdowns: byEducation, byDistrict, byCourse, byDate, byActivityType
        // NO individual student data exposed to colleges

        Map<String, Object> aggregated = new HashMap<>();
        aggregated.put("college_id", collegeId);
        aggregated.put("total_students_viewed", 1245);
        aggregated.put("total_views", 3850);
        aggregated.put("total_course_views", 1250);
        aggregated.put("total_saved", 320);
        aggregated.put("total_compared", 145);
        aggregated.put("total_enquiries", 82);
        aggregated.put("by_education", Map.of(
            "12th", 600,
            "Diploma", 200,
            "UG", 300,
            "PG", 80,
            "11th", 65
        ));
        aggregated.put("by_district", Map.of(
            "Coimbatore", 450,
            "Chennai", 320,
            "Madurai", 180,
            "Tiruppur", 120,
            "Salem", 90,
            "Trichy", 85
        ));
        aggregated.put("by_course", Map.of(
            "B.E Computer Science", 320,
            "B.Tech AI & Data Science", 180,
            "B.E Mechanical", 150,
            "BCA", 120,
            "MBA", 80,
            "B.E ECE", 110
        ));
        aggregated.put("by_activity_type", Map.of(
            "COLLEGE_VIEW", 3850,
            "COURSE_VIEW", 1250,
            "SAVE", 320,
            "COMPARE", 145,
            "ENQUIRY", 82
        ));
        aggregated.put("by_date", Map.of(
            "2026-09-01", 120,
            "2026-09-02", 150,
            "2026-09-03", 180
        ));
        aggregated.put("privacy_note", "Aggregated only - No individual browsing exposed to colleges. Only ENQUIRY with consent shares personal info. Student data belongs to platform and is protected.");

        return ResponseEntity.ok(aggregated);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentActivities(@PathVariable Long studentId) {
        // Only student themselves and platform admin can see their own activities
        // Mock
        return ResponseEntity.ok(Map.of(
            "student_id", studentId,
            "total_activities", 45,
            "college_views", 20,
            "course_views", 15,
            "saves", 5,
            "compares", 3,
            "enquiries", 2,
            "recently_viewed", List.of(101, 102, 103)
        ));
    }
}
