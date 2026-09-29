package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    private String reportType; // COLLEGE_INTEREST_REPORT
    private String period; // September 2026
    private String fileUrl; // S3 or local path to PDF
    private String fileName;

    // Summary metrics stored
    private Integer totalStudentsViewed;
    private Integer totalViews;
    private Integer totalSaves;
    private Integer totalComparisons;
    private Integer totalEnquiries;

    @Column(length = 5000)
    private String breakdownJson; // Full breakdown for PDF generation

    @Builder.Default
    private LocalDateTime generatedAt = LocalDateTime.now();
    private Long generatedBy; // Platform admin user id

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
