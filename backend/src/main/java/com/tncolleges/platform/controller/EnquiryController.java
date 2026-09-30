package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.Student;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.EnquiryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {
    private final EnquiryService enquiryService;
    private final CollegeAccessService collegeAccessService;
    private final CollegeRepository collegeRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public EnquiryController(EnquiryService enquiryService, CollegeAccessService collegeAccessService,
                             CollegeRepository collegeRepository, UserRepository userRepository,
                             StudentRepository studentRepository) {
        this.enquiryService = enquiryService;
        this.collegeAccessService = collegeAccessService;
        this.collegeRepository = collegeRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createEnquiry(@RequestBody Map<String, Object> payload,
                                           @AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        Map<String, Object> enquiry = enquiryService.create(user.getUsername(), payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Enquiry sent successfully with consent - College will contact you",
                "enquiry", enquiry,
                "privacy", "Personal info is shared only for this enquiry with consent. College cannot see browsing history."));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT','PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getStudentEnquiries(@PathVariable Long studentId,
                                                 @AuthenticationPrincipal UserDetails principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Account not found"));
        boolean platformAdmin = user.getRole() == User.Role.PLATFORM_ADMIN || user.getRole() == User.Role.SUPER_ADMIN;
        Long targetUserId = studentId;
        if (!platformAdmin) {
            Student profile = studentRepository.findByUser_Id(user.getId()).orElse(null);
            if (!user.getId().equals(studentId) && (profile == null || !profile.getId().equals(studentId))) {
                return ResponseEntity.status(403).body(Map.of("error", "Students can only view their own enquiries"));
            }
            targetUserId = user.getId();
        } else {
            User targetUser = userRepository.findById(studentId).filter(candidate -> candidate.getRole() == User.Role.STUDENT).orElse(null);
            if (targetUser == null) {
                Student profile = studentRepository.findById(studentId).orElse(null);
                if (profile != null && profile.getUser() != null) targetUserId = profile.getUser().getId();
            }
        }
        return ResponseEntity.ok(enquiryService.byStudent(targetUserId));
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> getCollegeEnquiries(@PathVariable Long collegeId,
                                                 @AuthenticationPrincipal UserDetails user) {
        if (user == null || !collegeRepository.findById(collegeId).filter(c -> c.isRegistered() && c.isActive()).isPresent()
                || !collegeAccessService.canManageCollege(user.getUsername(), collegeId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only view enquiries for a registered college you manage"));
        }
        List<Map<String, Object>> enquiries = enquiryService.byCollege(collegeId);
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (String status : List.of("New", "Contacted", "Follow-up", "Interested", "Closed")) {
            byStatus.put(status, enquiries.stream().filter(e -> status.equals(e.get("status"))).count());
        }
        return ResponseEntity.ok(Map.of(
                "college_id", collegeId,
                "total_enquiries", enquiries.size(),
                "by_status", byStatus,
                "enquiries", enquiries,
                "privacy_note", "Personal information appears only on enquiries submitted with explicit student consent."));
    }

    @PutMapping("/{enquiryId}/status")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN','COLLEGE_ADMIN','COLLEGE_EDITOR')")
    public ResponseEntity<?> updateEnquiryStatus(@PathVariable Long enquiryId,
                                                 @RequestBody Map<String, String> body,
                                                 @AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        boolean platformAdmin = user.getAuthorities().stream().anyMatch(authority ->
                authority.getAuthority().equals("ROLE_PLATFORM_ADMIN") || authority.getAuthority().equals("ROLE_SUPER_ADMIN"));
        return ResponseEntity.ok(enquiryService.updateStatus(enquiryId, body.get("status"), user.getUsername(), platformAdmin));
    }
}
