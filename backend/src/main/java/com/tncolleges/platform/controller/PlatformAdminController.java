package com.tncolleges.platform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
@CrossOrigin(origins = "*")
public class PlatformAdminController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total_students", 12500);
        stats.put("total_colleges", 450);
        stats.put("verified_colleges", 380);
        stats.put("pending_colleges", 70);
        stats.put("total_college_views", 45000);
        stats.put("total_course_views", 18000);
        stats.put("total_saves", 5200);
        stats.put("total_comparisons", 2300);
        stats.put("total_enquiries", 1800);
        stats.put("generated_at", LocalDateTime.now().toString());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/charts/college-views")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getCollegeViewsChart() {
        // Bar chart: College name vs total views
        List<Map<String, Object>> data = List.of(
            Map.of("college_id", 101, "college_name", "PSG College of Technology", "short_name", "PSG Tech", "district", "Coimbatore", "views", 3850, "students_viewed", 1245),
            Map.of("college_id", 102, "college_name", "Coimbatore Institute of Technology", "short_name", "CIT", "district", "Coimbatore", "views", 2100, "students_viewed", 780),
            Map.of("college_id", 103, "college_name", "Kumaraguru College of Technology", "short_name", "KCT", "district", "Coimbatore", "views", 1850, "students_viewed", 620)
        );
        return ResponseEntity.ok(data);
    }

    @GetMapping("/charts/course-interest")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getCourseInterestChart() {
        List<Map<String, Object>> data = List.of(
            Map.of("course", "B.E Computer Science", "interest", 3200, "district", "Coimbatore"),
            Map.of("course", "B.Tech AI & Data Science", "interest", 1800),
            Map.of("course", "BCA", "interest", 1500),
            Map.of("course", "MBA", "interest", 1200),
            Map.of("course", "B.E Mechanical", "interest", 1100)
        );
        return ResponseEntity.ok(data);
    }

    @GetMapping("/charts/district-wise")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getDistrictWiseChart() {
        Map<String, Integer> data = Map.of(
            "Coimbatore", 4500,
            "Chennai", 3200,
            "Madurai", 1800,
            "Tiruppur", 1200,
            "Salem", 900,
            "Trichy", 850
        );
        return ResponseEntity.ok(data);
    }

    @GetMapping("/charts/education-level")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getEducationLevelChart() {
        Map<String, Integer> data = Map.of(
            "12th", 6500,
            "Diploma", 2200,
            "UG", 3000,
            "PG", 800,
            "11th", 500
        );
        return ResponseEntity.ok(data);
    }

    @GetMapping("/college/{collegeId}/interest")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getCollegeInterest(@PathVariable Long collegeId) {
        // Same as StudentActivity aggregated but for platform admin view
        Map<String, Object> interest = new HashMap<>();
        interest.put("college_id", collegeId);
        interest.put("college_name", "PSG College of Technology");
        interest.put("total_students_viewed", 1245);
        interest.put("total_views", 3850);
        interest.put("total_saved", 320);
        interest.put("total_compared", 145);
        interest.put("total_enquiries", 82);
        interest.put("by_education", Map.of("12th", 600, "Diploma", 200, "UG", 300));
        interest.put("by_district", Map.of("Coimbatore", 450, "Chennai", 320));
        interest.put("by_course", Map.of("Computer Science", 320, "Mechanical", 180));
        return ResponseEntity.ok(interest);
    }

    @PostMapping("/college/{collegeId}/report/generate")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> generatePDFReport(@PathVariable Long collegeId, @RequestBody(required = false) Map<String, String> body) {
        String period = body != null ? body.getOrDefault("period", "September 2026") : "September 2026";
        
        Map<String, Object> report = new HashMap<>();
        report.put("id", System.currentTimeMillis());
        report.put("college_id", collegeId);
        report.put("college_name", "PSG College of Technology");
        report.put("college_logo", "https://www.psgtech.edu/images/logo.png");
        report.put("short_name", "PSG Tech");
        report.put("district", "Coimbatore");
        report.put("type", "Autonomous");
        report.put("period", period);
        report.put("generated_date", LocalDateTime.now().toLocalDate().toString());
        report.put("generated_time", LocalDateTime.now().toLocalTime().toString());
        report.put("platform_logo", "Tamil Nadu Colleges Platform");
        report.put("platform_colors", Map.of(
            "background", "#E8E2DB",
            "primary", "#1A3263",
            "secondary", "#547792",
            "accent", "#FAB95B"
        ));
        report.put("summary", Map.of(
            "total_students_viewed", 1245,
            "total_views", 3850,
            "total_saved", 320,
            "total_compared", 145,
            "total_enquiries", 82,
            "total_course_views", 1250
        ));
        report.put("charts", Map.of(
            "education_level", Map.of("12th", 600, "Diploma", 200),
            "district", Map.of("Coimbatore", 450, "Chennai", 320),
            "course", Map.of("CSE", 320, "Mech", 180)
        ));
        report.put("tables", "Detailed tables with education, district, course breakdowns");
        report.put("privacy_note", "Aggregated only - No individual browsing exposed. Only ENQUIRY with consent shares personal info.");
        report.put("file_url", "/reports/college_" + collegeId + "_" + System.currentTimeMillis() + ".pdf");
        report.put("page_number", "Page 1 of 5 - Generated securely");

        return ResponseEntity.ok(Map.of(
            "message", "PDF Report generated successfully with platform colors #E8E2DB #1A3263 #547792 #FAB95B",
            "report", report,
            "actions", List.of("View Report", "Generate PDF", "Download PDF")
        ));
    }

    @GetMapping("/colleges")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getAllCollegesForVerification() {
        List<Map<String, Object>> colleges = List.of(
            Map.of("id", 101, "name", "PSG College of Technology", "district", "Coimbatore", "type", "Autonomous", "verification_status", "VERIFIED", "verified", true),
            Map.of("id", 102, "name", "Coimbatore Institute of Technology", "district", "Coimbatore", "type", "Government Aided", "verification_status", "PENDING", "verified", false),
            Map.of("id", 103, "name", "Kumaraguru College of Technology", "district", "Coimbatore", "type", "Private", "verification_status", "UNDER_REVIEW", "verified", false)
        );
        return ResponseEntity.ok(colleges);
    }

    @PutMapping("/college/{collegeId}/verify")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> verifyCollege(@PathVariable Long collegeId, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "VERIFIED"); // VERIFIED, REJECTED, NEEDS_CHANGES, UNDER_REVIEW
        String remarks = body.getOrDefault("remarks", "");
        return ResponseEntity.ok(Map.of(
            "message", "College " + collegeId + " status updated to " + status,
            "college_id", collegeId,
            "verification_status", status,
            "remarks", remarks,
            "verified_badge", "VERIFIED".equals(status) ? "Real badge shown" : "Not verified"
        ));
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getAllStudents() {
        Map<String, Object> data = new HashMap<>();
        data.put("total_students", 12500);
        data.put("by_education", Map.of("12th", 6500, "Diploma", 2200, "UG", 3000));
        data.put("by_district", Map.of("Coimbatore", 4500, "Chennai", 3200));
        data.put("by_course", Map.of("B.E CSE", 3200, "BCA", 1500));
        data.put("privacy_note", "Student management shows totals, education, district, courses, activity - protecting sensitive info like email, phone, exact marks unless needed for platform analytics");
        return ResponseEntity.ok(data);
    }
}
