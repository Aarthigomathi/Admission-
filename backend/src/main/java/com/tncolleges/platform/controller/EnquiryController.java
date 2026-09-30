package com.tncolleges.platform.controller;

import com.tncolleges.platform.security.CollegeAccessService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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

    private final CollegeAccessService collegeAccessService;

    public EnquiryController(CollegeAccessService collegeAccessService) {
        this.collegeAccessService = collegeAccessService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
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

    // Until enquiry records are persisted and linked to a Student entity, limit this mock endpoint to platform admins.
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
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
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getCollegeEnquiries(@PathVariable Long collegeId,
                                                 @AuthenticationPrincipal UserDetails user) {
        if (user == null || !collegeAccessService.canManageCollege(user.getUsername(), collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied - you can only view enquiries for your own college"));
        }

        List<Map<String, Object>> enquiries = List.of(
            Map.ofEntries(
                Map.entry("id", 1),
                Map.entry("student_id", 1),
                Map.entry("student_name", "Rahul Kumar"),
                Map.entry("student_email", "rahul@example.com"),
                Map.entry("student_phone", "9876543210"),
                Map.entry("student_education", "12th"),
                Map.entry("student_district", "Coimbatore"),
                Map.entry("student_course_interest", "B.E Computer Science"),
                Map.entry("college_id", collegeId),
                Map.entry("question", "Admission process for CSE?"),
                Map.entry("status", "New"),
                Map.entry("consent_given", true),
                Map.entry("personal_info_shared", true),
                Map.entry("date", "2026-09-20")
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
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> updateEnquiryStatus(@PathVariable Long enquiryId, @RequestBody Map<String, String> body) {
        // This endpoint must be connected to a persisted EnquiryRepository before it can update data safely.
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(Map.of(
            "error", "Enquiry status updates are not implemented until enquiries are persisted",
            "enquiry_id", enquiryId
        ));
    }
}
