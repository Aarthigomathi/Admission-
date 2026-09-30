package com.tncolleges.platform.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.Report;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.ReportRepository;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.service.ReportPdfService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.tncolleges.platform.service.CollegeService;
import com.tncolleges.platform.service.PlatformAnalyticsService;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Platform Admin Dashboard - Analytics & PDF Reports
 * 
 * Platform Admin can:
 * - View totals: Total Students, Total Colleges, Verified, Pending, Total Views, Course Views, Saves, Comparisons, Enquiries
 * - Charts: College Views, Course Interest, District-wise Student Interest, Education Level, Popular Colleges, Popular Courses
 * - College-wise Student Interest: Total Students Viewed, Total Views, Saved, Compared, Enquiries + breakdowns
 * - College-wise PDF Report: Platform Logo, College Logo, College Name, Report Period, Summary, Charts, Tables, Generated Date, Page Number
 * - Buttons: View Report, Generate PDF, Download PDF
 * - College Management: Approve/Reject/Verify/Request Changes/View Info/Analytics/PDF Report
 * - Student Management: Totals, Education Level, District, Courses, Activity - protecting sensitive info
 * 
 * Privacy: Do NOT expose individual browsing to colleges, only aggregated
 */
@RestController
@RequestMapping("/api/platform-admin")
public class PlatformAdminController {
    private final CollegeService collegeService;
    private final PlatformAnalyticsService analyticsService;
    private final CollegeRepository collegeRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReportPdfService reportPdfService;
    private final ObjectMapper objectMapper;

    public PlatformAdminController(CollegeService collegeService, PlatformAnalyticsService analyticsService,
                                   CollegeRepository collegeRepository, ReportRepository reportRepository,
                                   UserRepository userRepository, ReportPdfService reportPdfService,
                                   ObjectMapper objectMapper) {
        this.collegeService = collegeService;
        this.analyticsService = analyticsService;
        this.collegeRepository = collegeRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.reportPdfService = reportPdfService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.dashboard());
    }

    @GetMapping("/charts/college-views")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getCollegeViewsChart() {
        return ResponseEntity.ok(analyticsService.collegeViewsChart());
    }

    @GetMapping("/charts/course-interest")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getCourseInterestChart() {
        return ResponseEntity.ok(analyticsService.courseInterestChart());
    }

    @GetMapping("/charts/district-wise")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getDistrictWiseChart() {
        return ResponseEntity.ok(analyticsService.districtWiseInterest());
    }

    @GetMapping("/charts/education-level")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getEducationLevelChart() {
        return ResponseEntity.ok(analyticsService.educationLevelInterest());
    }

    @GetMapping("/college/{collegeId}/interest")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getCollegeInterest(@PathVariable Long collegeId) {
        return ResponseEntity.ok(analyticsService.collegeInterest(collegeId));
    }

    @PostMapping("/college/{collegeId}/report/generate")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> generatePDFReport(@PathVariable Long collegeId,
                                                @RequestBody(required = false) Map<String, String> body,
                                                @AuthenticationPrincipal UserDetails principal) throws JsonProcessingException {
        College college = collegeRepository.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
        String period = body == null ? "All time" : body.getOrDefault("period", "All time");
        Map<String, Object> summary = analyticsService.collegeInterest(collegeId);
        Long generatedBy = principal == null ? null : userRepository.findByEmail(principal.getUsername()).map(User::getId).orElse(null);
        Report saved = reportRepository.save(Report.builder()
                .collegeId(collegeId)
                .reportType("COLLEGE_INTEREST_REPORT")
                .period(period)
                .fileName("college-" + collegeId + "-report.pdf")
                .totalStudentsViewed(number(summary.get("total_students_viewed")))
                .totalViews(number(summary.get("total_views")))
                .totalSaves(number(summary.get("total_saved")))
                .totalComparisons(number(summary.get("total_compared")))
                .totalEnquiries(number(summary.get("total_enquiries")))
                .breakdownJson(objectMapper.writeValueAsString(summary))
                .generatedBy(generatedBy)
                .build());
        saved.setFileUrl("/api/platform-admin/reports/" + saved.getId() + "/download");
        saved = reportRepository.save(saved);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Report snapshot generated and saved");
        response.put("report_id", saved.getId());
        response.put("college_id", collegeId);
        response.put("college_name", college.getName());
        response.put("short_name", college.getShortName());
        response.put("district", college.getDistrict());
        response.put("period", period);
        response.put("generated_date", saved.getGeneratedAt().toLocalDate().toString());
        response.put("summary", summary);
        response.put("file_url", saved.getFileUrl());
        response.put("file_name", saved.getFileName());
        response.put("actions", List.of("View Report", "Download PDF"));
        return ResponseEntity.status(201).body(Map.of("report", response));
    }

    @GetMapping("/college/{collegeId}/reports")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getReports(@PathVariable Long collegeId) {
        if (collegeRepository.findById(collegeId).filter(College::isRegistered).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(reportRepository.findByCollegeIdOrderByGeneratedAtDesc(collegeId));
    }

    @GetMapping("/reports/{reportId}/download")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long reportId) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new NoSuchElementException("Report not found"));
        byte[] pdf = reportPdfService.generate(report);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(report.getFileName()).build().toString())
                .body(pdf);
    }

    private Integer number(Object value) {
        return value instanceof Number number ? number.intValue() : 0;
    }

    @GetMapping("/colleges")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getAllCollegesForVerification() {
        return ResponseEntity.ok(collegeService.allForPlatformAdmin());
    }

    @PatchMapping("/colleges/{collegeId}/verify")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> verifyRegisteredCollege(@PathVariable Long collegeId, @RequestBody(required = false) Map<String, String> body,
                                                     @AuthenticationPrincipal UserDetails principal) {
        String status = body == null ? "VERIFIED" : body.getOrDefault("status", "VERIFIED");
        String remarks = body == null ? "" : body.getOrDefault("remarks", "");
        Long adminId = principal == null ? null : userRepository.findByEmail(principal.getUsername()).map(User::getId).orElse(null);
        return ResponseEntity.ok(collegeService.verify(collegeId, status, remarks, adminId));
    }

    @PutMapping("/college/{collegeId}/verify")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> verifyCollege(@PathVariable Long collegeId, @RequestBody(required = false) Map<String, String> body,
                                           @AuthenticationPrincipal UserDetails principal) {
        String status = body == null ? "VERIFIED" : body.getOrDefault("status", "VERIFIED");
        String remarks = body == null ? "" : body.getOrDefault("remarks", "");
        Long adminId = principal == null ? null : userRepository.findByEmail(principal.getUsername()).map(User::getId).orElse(null);
        return ResponseEntity.ok(collegeService.verify(collegeId, status, remarks, adminId));
    }

    @GetMapping("/student-visits")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getStudentVisitAudit(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate from,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate to,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(analyticsService.studentVisitAudit(collegeId, studentId, from, to, search, page, size));
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(analyticsService.studentSummary());
    }
}
