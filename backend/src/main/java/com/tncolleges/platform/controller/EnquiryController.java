package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.Enquiry;
import com.tncolleges.platform.model.StudentActivity;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.EnquiryRepository;
import com.tncolleges.platform.repository.StudentActivityRepository;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {
    private final EnquiryRepository enquiryRepo;
    private final CollegeRepository collegeRepo;
    private final StudentActivityRepository activityRepo;
    private final StudentRepository studentRepo;
    private final UserRepository userRepo;

    public EnquiryController(EnquiryRepository enquiryRepo, CollegeRepository collegeRepo,
                             StudentActivityRepository activityRepo, StudentRepository studentRepo,
                             UserRepository userRepo) {
        this.enquiryRepo = enquiryRepo;
        this.collegeRepo = collegeRepo;
        this.activityRepo = activityRepo;
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createEnquiry(@RequestBody Map<String, Object> payload) {
        if (!Boolean.TRUE.equals(payload.get("consent"))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Consent is required before sharing contact details with the college."
            ));
        }
        Long collegeId = asLong(payload.get("college_id"));
        if (collegeId == null) return ResponseEntity.badRequest().body(Map.of("error", "college_id is required"));
        College college = collegeRepo.findById(collegeId).orElse(null);
        if (college == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "College not found"));

        Long studentId = asLong(payload.get("student_id"));
        String contactMethod = value(payload.get("contact_method"), "Email");
        Enquiry enquiry = enquiryRepo.save(Enquiry.builder()
                .college(college)
                .studentId(studentId)
                .courseId(asLong(payload.get("course_id")))
                .contactMethod(contactMethod)
                .consentGiven(true)
                .personalInfoShared(true)
                .name(value(payload.get("student_name"), "Student"))
                .email(value(payload.get("student_email"), ""))
                .phone(value(payload.get("student_phone"), ""))
                .courseInterested(value(payload.get("course"), value(payload.get("course_name"), "")))
                .message(value(payload.get("question"), ""))
                .status("New")
                .createdAt(LocalDateTime.now())
                .build());

        if (studentId != null) {
            activityRepo.save(StudentActivity.builder()
                    .studentId(studentId)
                    .collegeId(collegeId)
                    .courseId(enquiry.getCourseId())
                    .date(LocalDate.now())
                    .time(LocalTime.now())
                    .activityType(StudentActivity.ActivityType.ENQUIRY)
                    .personalInfoShared(true)
                    .metadata("{\"consent\":true}")
                    .build());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Enquiry sent with consent.",
                "enquiry", enquiryPayload(enquiry),
                "privacy_note", "Only this consented enquiry shares contact details; browsing activity stays aggregate-only."
        ));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT','SUPER_ADMIN','PLATFORM_ADMIN')")
    public ResponseEntity<?> getStudentEnquiries(@PathVariable Long studentId,
                                                 @AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user != null && user.getRole() == User.Role.STUDENT) {
            Long ownId = studentRepo.findByUserId(user.getId()).map(student -> student.getId()).orElse(null);
            if (!studentId.equals(ownId)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
        }
        List<Map<String, Object>> result = enquiryRepo.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream().map(this::enquiryPayload).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN','COLLEGE_EDITOR','PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getCollegeEnquiries(@PathVariable Long collegeId,
                                                 @AuthenticationPrincipal UserDetails principal) {
        ResponseEntity<?> denied = authorizeCollege(collegeId, principal);
        if (denied != null) return denied;
        List<Map<String, Object>> enquiries = enquiryRepo.findByCollege_IdOrderByCreatedAtDesc(collegeId)
                .stream().filter(Enquiry::isConsentGiven).map(this::enquiryPayload).toList();
        return ResponseEntity.ok(Map.of("college_id", collegeId, "total_enquiries", enquiries.size(), "enquiries", enquiries,
                "privacy_note", "Only enquiries submitted with explicit consent include contact details."));
    }

    @PutMapping("/{enquiryId}/status")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN','COLLEGE_EDITOR','PLATFORM_ADMIN','SUPER_ADMIN')")
    @Transactional
    public ResponseEntity<?> updateEnquiryStatus(@PathVariable Long enquiryId, @RequestBody Map<String, String> body,
                                                  @AuthenticationPrincipal UserDetails principal) {
        Enquiry enquiry = enquiryRepo.findById(enquiryId).orElse(null);
        if (enquiry == null) return ResponseEntity.notFound().build();
        ResponseEntity<?> denied = authorizeCollege(enquiry.getCollege().getId(), principal);
        if (denied != null) return denied;
        String status = body.getOrDefault("status", "Contacted");
        if (!List.of("New", "Contacted", "Follow-up", "Interested", "Closed").contains(status)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unsupported enquiry status"));
        }
        enquiry.setStatus(status);
        enquiryRepo.save(enquiry);
        return ResponseEntity.ok(Map.of("message", "Enquiry status updated", "enquiry_id", enquiryId, "status", status));
    }

    private ResponseEntity<?> authorizeCollege(Long collegeId, UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user != null && user.getRole() != User.Role.SUPER_ADMIN && user.getRole() != User.Role.PLATFORM_ADMIN
                && !collegeId.equals(user.getCollegeId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied for this college"));
        }
        return null;
    }

    private Map<String, Object> enquiryPayload(Enquiry enquiry) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", enquiry.getId());
        item.put("student_id", enquiry.getStudentId());
        item.put("college_id", enquiry.getCollege().getId());
        item.put("college_name", enquiry.getCollege().getName());
        item.put("course_id", enquiry.getCourseId());
        item.put("course", enquiry.getCourseInterested());
        item.put("question", enquiry.getMessage());
        item.put("contact_method", enquiry.getContactMethod());
        item.put("status", enquiry.getStatus());
        item.put("consent_given", enquiry.isConsentGiven());
        item.put("personal_info_shared", enquiry.isPersonalInfoShared());
        item.put("student_name", enquiry.isConsentGiven() ? enquiry.getName() : "");
        item.put("student_email", enquiry.isConsentGiven() ? enquiry.getEmail() : "");
        item.put("student_phone", enquiry.isConsentGiven() ? enquiry.getPhone() : "");
        item.put("date", enquiry.getCreatedAt().toLocalDate().toString());
        item.put("time", enquiry.getCreatedAt().toLocalTime().toString());
        return item;
    }

    private String value(Object raw, String fallback) {
        String text = raw == null ? "" : String.valueOf(raw).trim();
        return text.isBlank() ? fallback : text;
    }

    private Long asLong(Object raw) {
        try { return raw == null ? null : Long.valueOf(String.valueOf(raw)); }
        catch (NumberFormatException ex) { return null; }
    }
}
