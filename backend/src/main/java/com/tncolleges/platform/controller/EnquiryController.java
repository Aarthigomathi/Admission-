package com.tncolleges.platform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

/**
 * Enquiry System - Consent Based Only
 * 
 * Flow:
 * Student selects College, Course, Question, Preferred Contact Method, Submit
 * College receives via dashboard with status: New, Contacted, Follow-up, Interested, Closed
 * Only enquiry-related info shared with consent - Privacy protected
 * 
 * Privacy Rule:
 * If student simply views college page, DO NOT automatically send personal info to college
 * College should NOT get student name, phone, email, browsing history
 * Platform stores activity securely
 * Only when student explicitly clicks ENQUIRE NOW and agrees to share, relevant info sent to college
 */
@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "*")
public class EnquiryController {

    @PostMapping
    public ResponseEntity<?> createEnquiry(@RequestBody Map<String, Object> payload) {
        // Required: student_id, college_id, course_id (optional), question, contact_method, consent
        Boolean consent = (Boolean) payload.getOrDefault("consent", false);
        if (!Boolean.TRUE.equals(consent)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Consent required to share info with college",
                "privacy_rule", "Viewing does NOT auto-share personal info. Only ENQUIRE NOW with consent shares."
            ));
        }

        Map<String, Object> enquiry = new HashMap<>();
        enquiry.put("id", System.currentTimeMillis());
        enquiry.put("student_id", payload.get("student_id"));
        enquiry.put("college_id", payload.get("college_id"));
        enquiry.put("college_name", payload.getOrDefault("college_name", "College"));
        enquiry.put("course_id", payload.get("course_id"));
        enquiry.put("question", payload.get("question"));
        enquiry.put("contact_method", payload.getOrDefault("contact_method", "Email"));
        enquiry.put("status", "New");
        enquiry.put("consent_given", true);
        enquiry.put("personal_info_shared", true); // Only true when consent given for ENQUIRY
        enquiry.put("date", LocalDate.now().toString());
        enquiry.put("time", LocalTime.now().toString());
        enquiry.put("created_at", new Date().toString());

        // In real app: enquiryRepository.save(), notification to college admin, track activity ENQUIRY

        return ResponseEntity.ok(Map.of(
            "message", "Enquiry sent successfully with consent - College will contact you",
            "enquiry", enquiry,
            "privacy", "Personal info shared only for this enquiry with consent. College cannot see your browsing history."
        ));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentEnquiries(@PathVariable Long studentId) {
        List<Map<String, Object>> enquiries = List.of(
            Map.of(
                "id", 1,
                "college_id", 101,
                "college_name", "PSG College of Technology",
                "course", "B.E Computer Science",
                "question", "What is the cutoff for CSE? Hostel available?",
                "status", "Contacted",
                "date", "2026-09-20",
                "contact_method", "Email"
            )
        );
        return ResponseEntity.ok(enquiries);
    }

    @GetMapping("/college/{collegeId}")
    public ResponseEntity<?> getCollegeEnquiries(@PathVariable Long collegeId,
                                                 @RequestHeader(value = "X-College-Id", required = false) Long headerCollegeId,
                                                 @RequestHeader(value = "X-User-Role", required = false) String role) {
        // College admin can only see own college enquiries - college_id isolation
        if (headerCollegeId != null && !Objects.equals(collegeId, headerCollegeId) && !"PLATFORM_ADMIN".equals(role) && !"SUPER_ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied - College ID isolation"));
        }

        List<Map<String, Object>> enquiries = List.of(
            Map.of(
                "id", 1,
                "student_id", 1,
                "student_name", "Rahul Kumar",
                "student_email", "rahul@example.com",
                "student_phone", "9876543210",
                "student_education", "12th",
                "student_district", "Coimbatore",
                "student_course_interest", "B.E Computer Science",
                "college_id", collegeId,
                "question", "Admission process for CSE?",
                "status", "New",
                "consent_given", true,
                "personal_info_shared", true,
                "date", "2026-09-20"
            )
        );
        return ResponseEntity.ok(Map.of(
            "college_id", collegeId,
            "total_enquiries", 82,
            "by_status", Map.of("New", 12, "Contacted", 20, "Follow-up", 15, "Interested", 25, "Closed", 10),
            "enquiries", enquiries,
            "privacy_note", "Only enquiries with consent show personal info. Aggregated views do NOT expose individual browsing."
        ));
    }

    @PutMapping("/{enquiryId}/status")
    public ResponseEntity<?> updateEnquiryStatus(@PathVariable Long enquiryId, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "Contacted"); // New, Contacted, Follow-up, Interested, Closed
        return ResponseEntity.ok(Map.of(
            "message", "Enquiry " + enquiryId + " status updated to " + status,
            "enquiry_id", enquiryId,
            "status", status
        ));
    }
}
